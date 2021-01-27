/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const path = require('path');
const WebpackConfigTerra = require('@cerner/webpack-config-terra');

const DirectorySwitcherPlugin = require('./config/webpack/plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./config/webpack/plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntrypoints = require('./config/webpack/plugin/TerraDevSiteEntrypoints');
const TerraDevSite = require('./config/webpack/plugin/TerraDevSite');

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = { p: false }) => {
  const production = argv.p;
  const processPath = process.cwd();

  return {
    entry: TerraDevSiteEntrypoints,
    plugins: [
      new TerraDevSite({ env }),
    ],
    resolve: {
      plugins: [
        new DirectorySwitcherPlugin({
          shouldSwitch: !production,
          rootDirectories: [
            processPath,
            path.resolve(processPath, '*'),
          ],
        }),
        new LocalPackageAliasPlugin({
          rootDirectories: [
            processPath,
            path.resolve(processPath, '*'),
          ],
        }),
      ],
    },
  };
};

const webpackConfig = (env, argv) => (
  merge(WebpackConfigTerra(env, argv), devSiteConfig(env, argv))
);

module.exports = webpackConfig;
