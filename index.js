const DirectorySwitcherPlugin = require('./plugin/resolve/DirectorySwitcherPlugin');
const LocalPackageAliasPlugin = require('./plugin/resolve/LocalPackageAliasPlugin');
const TerraDevSiteEntryPoints = require('./plugin/webpack/TerraDevSiteEntryPoints');
const TerraDevSiteGeneratePlugin = require('./plugin/webpack/TerraDevSiteGeneratePlugin');
const TerraDevSitePlugin = require('./plugin/webpack/TerraDevSitePlugin');
const TerraDevSiteSetupPlugin = require('./plugin/webpack/TerraDevSiteSetupPlugin');

module.exports = {
  DirectorySwitcherPlugin,
  LocalPackageAliasPlugin,
  TerraDevSiteEntryPoints,
  TerraDevSiteGeneratePlugin,
  TerraDevSitePlugin,
  TerraDevSiteSetupPlugin,
};
