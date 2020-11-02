const DirectorySwitcherPlugin = require('./webpack/plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./webpack/plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntrypoints = require('./webpack/plugin/TerraDevSiteEntrypoints');
const TerraDevSite = require('./webpack/plugin/TerraDevSite');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntrypoints,
  TerraDevSite,
};
