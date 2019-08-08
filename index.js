const DirectorySwitcherPlugin = require('./plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntryPoints = require('./plugin/webpack/TerraDevSiteEntryPoints');
const TerraDevSitePlugin = require('./plugin/webpack/TerraDevSitePlugin');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntryPoints,
  TerraDevSitePlugin,
};
