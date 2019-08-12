const DirectorySwitcherPlugin = require('./config/webpack/plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./config/webpack/plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntryPoints = require('./config/webpack/plugin/TerraDevSiteEntryPoints');
const TerraDevSitePlugin = require('./config/webpack/plugin/TerraDevSitePlugin');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntryPoints,
  TerraDevSitePlugin,
};
