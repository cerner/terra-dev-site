const merge = require('webpack-merge');
const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');
const path = require('path');
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
  siteConfig.appConfig.headline = 'Terra Application';

  // Is hot reloading enabled?
  const { hotReloading } = siteConfig;

  return {
    entry: {
      'terra-application/index': path.resolve(path.join(__dirname, 'lib', 'AppsIndex')),
      ...TerraDevSiteEntryPoints,
    },
    plugins: [
      new TerraDevSitePlugin({
        env,
        sites: [{
          siteConfig,
          basenameDefine: 'TERRA_APPLICATION_DEV_SITE_BASENAME',
          prefix: 'terra-application',
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
