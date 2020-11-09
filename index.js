const DirectorySwitcherPlugin = require('./lib/webpack/plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./lib/webpack/plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntrypoints = require('./lib/webpack/plugin/TerraDevSiteEntrypoints');
const TerraDevSite = require('./lib/webpack/plugin/TerraDevSite');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntrypoints,
  TerraDevSite,
};
