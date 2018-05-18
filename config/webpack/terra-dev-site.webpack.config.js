const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const generateAppConfig = require('../../scripts/generate-app-config/generateAppConfig');
const loadSiteConfig = require('../../scripts/generate-app-config/loadSiteConfig');
const fs = require('fs');

/**
* Add's an alias and a 'source' alias if not in prod mode and hot reloading is enabled.
*/
const addAlias = (acc, name, location, hotReloading, dist, source, production) => {
  acc[name] = location;
  if (!production && hotReloading) {
    acc[path.join(name, dist)] = path.join(location, source);
  }
};

/**
* Aliases all mono-repo packages. This ensures the correct module is hit if the site is hosting an item used to create itself (ouroboros).
*/
const aliasMonoRepoPackages = (hotReloading, monoRepo, production) => {
  // If no package directory is found, do nothing.
  if (!fs.existsSync(monoRepo.packages)) {
    return {};
  }
  // For each non hidden directory, create an alias.
  return fs.readdirSync(monoRepo.packages).reduce((acc, packageName) => {
    // ignore any hidden files
    if (packageName[0] !== '.') {
      addAlias(acc, packageName, path.join(monoRepo.packages, packageName), hotReloading, monoRepo.dist, monoRepo.source, production);
    }
    return acc;
  }, {});
};

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = {}) => {
  const production = argv.p;
  const processPath = process.cwd();
  const verbose = env.verboseGenerateAppConfig;

  // Get the root path of a mono-repo process call
  const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

  // Get the site configuration to add as a resolve path
  const devSiteConfigPath = path.resolve(path.join(rootPath, 'dev-site-config'));

  // Get default site config.
  const siteConfig = loadSiteConfig();

  // Generate the files need to spin up the site.
  generateAppConfig(siteConfig, production, verbose);

  // Is hot reloading enabled?
  const { hotReloading, monoRepo } = siteConfig;

  // Setup auto aliases.
  const alias = {
    ...aliasMonoRepoPackages(hotReloading, monoRepo, production),
  };

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('Generated Aliases', alias);
  }

  return {
    entry: {
      'terra-dev-site': path.resolve(path.join(__dirname, '..', '..', 'lib', 'Index')),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: siteConfig.appConfig.title,
        template: path.join(__dirname, '..', '..', 'lib', 'index.html'),
        favicon: siteConfig.appConfig.favicon,
      }),
    ],
    resolve: {
      modules: [devSiteConfigPath],
      alias,
    },
  };
};

module.exports = devSiteConfig;
