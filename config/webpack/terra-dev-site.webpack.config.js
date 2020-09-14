const path = require('path');
const TerraDevSite = require('./plugin/TerraDevSite');
const TerraDevSiteEntrypoints = require('./plugin/TerraDevSiteEntrypoints');
const DirectorySwitcherPlugin = require('./plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./plugin/resolve/LocalPackageAliasPlugin');

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = {}) => {
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
