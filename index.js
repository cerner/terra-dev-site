const DirectorySwitcherPlugin = require('./config/webpack/plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./config/webpack/plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntryPoints = require('./config/webpack/plugin/TerraDevSiteEntryPoints');
const TerraDevSite = require('./config/webpack/plugin/TerraDevSite');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntryPoints,
  TerraDevSite,
};
