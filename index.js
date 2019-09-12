const DirectorySwitcherPlugin = require('./config/webpack/plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./config/webpack/plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntrypoints = require('./config/webpack/plugin/TerraDevSiteEntrypoints');
const TerraDevSite = require('./config/webpack/plugin/TerraDevSite');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntrypoints,
  TerraDevSite,
};
