const path = require('path');
const loadSiteConfig = require('../../scripts/generate-app-config/loadSiteConfig');
const TerraDevSitePlugin = require('./plugin/TerraDevSitePlugin');
const TerraDevSiteEntryPoints = require('./plugin/TerraDevSiteEntryPoints');
const DirectorySwitcherPlugin = require('../../plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('../../plugin/resolve/LocalPackageAliasPlugin');

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = {}) => {
  const production = argv.p;
  const processPath = process.cwd();

  // Load the site configuration.
  const siteConfig = loadSiteConfig();

  // Is hot reloading enabled?
  const { hotReloading, webpackAliasOptions } = siteConfig;

  return {
    entry: TerraDevSiteEntryPoints,
    plugins: [
      new TerraDevSitePlugin({ env }),
    ],
    resolve: {
      plugins: [
        new DirectorySwitcherPlugin({
          shouldSwitch: hotReloading && !production,
          source: webpackAliasOptions.source,
          distribution: webpackAliasOptions.dist,
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
  };
};

module.exports = devSiteConfig;
