const merge = require('webpack-merge');
const path = require('path');
const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');
const loadSiteConfig = require('./scripts/generate-app-config/loadSiteConfig');
const TerraDevSitePlugin = require('./config/webpack/plugin/TerraDevSitePlugin');
const TerraDevSiteEntryPoints = require('./config/webpack/plugin/TerraDevSiteEntryPoints');
const DirectorySwitcherPlugin = require('./config/webpack/plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./config/webpack/plugin/resolve/LocalPackageAliasPlugin');

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = {}) => {
  const production = argv.p;

  // Load the site configuration.
  const siteConfig = loadSiteConfig();
  siteConfig.generatePages.searchPatterns[0].entryPoint = 'terra-application';
  siteConfig.appConfig.subline = 'Terra Application';

  // Is hot reloading enabled?
  const { hotReloading } = siteConfig;

  return {
    entry: {
      ...TerraDevSiteEntryPoints,
    },
    plugins: [
      new TerraDevSitePlugin({
        env,
        sites: [{
          siteConfig,
          prefix: 'terra-application',
          indexPath: path.resolve(path.join(__dirname, 'lib', 'AppsIndex')),
        }],
      }),
    ],
    resolve: {
      plugins: [
        new DirectorySwitcherPlugin({
          shouldSwitch: hotReloading && !production,
        }),
        new LocalPackageAliasPlugin(),
      ],
    },
  };
};

const mergedConfig = (env, argv) => (
  merge.strategy({
    'resolve.modules': 'prepend',
  })(defaultWebpackConfig(env, argv), devSiteConfig(env, argv))
);

module.exports = mergedConfig;
