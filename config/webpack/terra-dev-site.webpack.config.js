const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadSiteConfig = require('../../scripts/generate-app-config/loadSiteConfig');
const getNewRelicJS = require('../../scripts/new-relic/getNewRelicJS');
const DirectorySwitcherPlugin = require('./plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./plugin/resolve/LocalPackageAliasPlugin');

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

  // Is hot reloading enabled?
  const { hotReloading } = siteConfig;

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
      plugins: [
        new DirectorySwitcherPlugin({
          shouldSwitch: hotReloading && !production,
          rootDirectories: [
            processPath,
            path.resolve(processPath, 'packages', '*'),
          ],
        }),
        new LocalPackageAliasPlugin({
          rootDirectories: [
            processPath,
            path.resolve(processPath, 'packages', '*'),
          ],
        }),
      ],
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
