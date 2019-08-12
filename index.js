const DirectorySwitcherPlugin = require('./plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntryPoints = require('./config/webpack/plugin/TerraDevSiteEntryPoints');
const TerraDevSitePlugin = require('./config/webpack/plugin/TerraDevSitePlugin');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntryPoints,
  TerraDevSitePlugin,
};
