const path = require('path');
const { DefinePlugin } = require('webpack');
const SetupPlugin = require('./SetupPlugin');
const GeneratePlugin = require('./GeneratePlugin');
const loadSiteConfig = require('../../../scripts/generate-app-config/loadSiteConfig');

/**
 * Generate a terra-dev-site
 */
class TerraDevSitePlugin {
  constructor({ env, sites = [] } = {}) {
    // default local for site
    this.lang = env.defaultLocale;
    // Sites to generate. Add the default site then load the config if not present
    this.sites = [
      {
        configFileName: 'site.config.js',
        defaultConfigPath: path.resolve(__dirname, '..', '..', 'site', 'site.config.js'),
        indexPath: path.resolve(__dirname, '..', '..', '..', 'lib', 'TerraDevSite'),
      },
      ...sites,
    ].map(site => ({
      ...site,
      // load config if siteConfig is not already defined.
      siteConfig: site.siteConfig || loadSiteConfig(site.configFileName, site.defaultConfigPath),
    }));
  }

  apply(compiler) {
    // Use default plublic path else the env else /
    let publicPath = process.env.TERRA_DEV_SITE_PUBLIC_PATH || '/';
    if (compiler.options.output && compiler.options.output.publicPath) {
      ({ publicPath } = compiler.options.output);
    }

    // Strip the trailing / from the public path.
    const basename = publicPath.slice(0, -1);
    new GeneratePlugin({
      sites: this.sites,
      basename,
      lang: this.lang,
    }).apply(compiler);
    new SetupPlugin({
      publicPath,
    }).apply(compiler);
    new DefinePlugin({
      // Base name is used to namespace terra-dev-site this is used in redirect.js
      TERRA_DEV_SITE_BASENAME: JSON.stringify(basename),
    }).apply(compiler);
  }
}

module.exports = TerraDevSitePlugin;
