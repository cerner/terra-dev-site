const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const webpack = require('webpack');
const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadSiteConfig = require('../../scripts/generate-app-config/loadSiteConfig');
const getNewRelicJS = require('../../scripts/new-relic/getNewRelicJS');

/**
* Adds the dist and source alias if not in prod mode and hot reloading is enabled.
*/
const addAlias = (acc, name, location, hotReloading, { dist, source }, production) => {
  if (!production && hotReloading) {
    acc[path.join(name, dist)] = path.join(location, source);
  }
  // Always place the more specific aliases above the less specific aliases.
  acc[name] = location;
};

/**
* Alias the current package. This is so you can reference examples as if they are external packages.
*/
const aliasCurrentPackage = (packageName, processPath, hotReloading, webpackAliasOptions = {}, production) => {
  const alias = {};
  addAlias(alias, packageName, processPath, hotReloading, webpackAliasOptions, production);
  return alias;
};

/**
* Aliases all mono-repo packages. This ensures the correct module is used if the site is hosting an item used to create itself (ouroboros).
*/
const aliasMonoRepoPackages = (monoRepo, hotReloading, webpackAliasOptions = {}, production) => {
  // Use glob to discover all valid package directories. Chop the filename off.
  const packagePaths = monoRepo.packages.reduce((acc, packageDir) => (
    acc.concat(glob.sync(`${packageDir}/*/package.json`))
  ), []).map(pkgPath => path.dirname(pkgPath));
  // const packagePaths = glob.sync(path.join(monoRepo.packages, '*', 'package.json')).map(pkgPath => path.dirname(pkgPath));

  // For each directoryPath, create an alias.
  return packagePaths.reduce((acc, packagePath) => {
    addAlias(acc, path.basename(packagePath), packagePath, hotReloading, webpackAliasOptions, production);
    return acc;
  }, {});
};

/**
* Create index.html files for terra-dev-site and the additional apps.
*/
const indexPlugin = ({
  title, filename, lang, rootElementId = 'root', siteConfig, indexEntryPoints, entry,
}) => {
  const otherIndexChunks = indexEntryPoints.filter(indexEntry => indexEntry !== entry);
  return new HtmlWebpackPlugin({
    title,
    filename,
    template: path.join(__dirname, '..', '..', 'lib', 'index.html'),
    lang,
    rootElementId,
    dir: siteConfig.appConfig.defaultDirection,
    favicon: siteConfig.appConfig.favicon,
    headHtml: [getNewRelicJS()].concat(siteConfig.appConfig.headHtml),
    headChunks: ['rewriteHistory'],
    excludeChunks: ['redirect', ...otherIndexChunks],
    inject: false, // This turns off auto injection. We handle this ourselves in the template.
  });
};

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = {}) => {
  const production = argv.p;
  const processPath = process.cwd();
  const verbose = env.verboseGenerateAppConfig;
  const publicPath = argv['output-public-path'] || process.env.TERRA_DEV_SITE_PUBLIC_PATH || '/';

  // Get the site configuration to add as a resolve path
  const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));

  // Load the site configuration.
  const siteConfig = loadSiteConfig();

  // Populate lang variable, prefer env over siteConfig;
  const lang = env.defaultLocale || siteConfig.appConfig.defaultLocale;

  // Generate the files need to spin up the site.
  generateAppConfig(siteConfig, production, verbose);

  // Get the default package name.
  const packageName = siteConfig.npmPackage.name;

  // Is hot reloading enabled?
  const { hotReloading, monoRepo, webpackAliasOptions } = siteConfig;

  // Add the auto aliases for the current packages and all mono-repo packages.
  const alias = {
    ...aliasMonoRepoPackages(monoRepo, hotReloading, webpackAliasOptions, production),
    ...aliasCurrentPackage(packageName, processPath, hotReloading, webpackAliasOptions, production),
  };

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('Generated Aliases', alias);
  }

  const indexEntryPoints = [];
  indexEntryPoints.push('terra-dev-site');
  // Strip the trailing / from the public path.
  const basename = publicPath.slice(0, -1);

  return {
    entry: {
      'terra-dev-site': path.resolve(path.join(__dirname, '..', '..', 'lib', 'Index')),
      rewriteHistory: path.resolve(path.join(__dirname, '..', '..', 'lib', 'rewriteHistory')),
      redirect: path.resolve(path.join(__dirname, '..', '..', 'lib', 'redirect')),
    },
    plugins: [
      // terra-dev-site index.html
      indexPlugin({
        title: siteConfig.appConfig.title,
        filename: 'index.html',
        lang,
        siteConfig,
        indexEntryPoints,
        entry: 'terra-dev-site',
      }),
      // 404.html
      new HtmlWebpackPlugin({
        filename: '404.html',
        template: path.join(__dirname, '..', '..', 'lib', '404.html'),
        inject: 'head',
        chunks: ['redirect'],
      }),
      new webpack.DefinePlugin({
        // Base name is used to namespace terra-dev-site
        TERRA_DEV_SITE_BASENAME: JSON.stringify(basename),
      }),
    ],
    resolve: {
      modules: [devSiteConfigPath],
      alias,
    },
    output: {
      publicPath,
    },
    devServer: {
      historyApiFallback: true,
    },
    ...(production) && { devtool: 'source-map' },
  };
};

module.exports = devSiteConfig;
