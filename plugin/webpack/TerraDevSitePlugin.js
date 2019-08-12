const TerraDevSiteSetupPlugin = require('./TerraDevSiteSetupPlugin');
const TerraDevSiteGeneratePlugin = require('./TerraDevSiteGeneratePlugin');
const loadSiteConfig = require('../../scripts/generate-app-config/loadSiteConfig');

class TerraDevSitePlugin {
  constructor({ env, sites = [] } = {}) {
    this.lang = env.defaultLocale;
    this.sites = sites;
    this.sites.unshift({
      siteConfig: loadSiteConfig(),
      basenameDefine: 'TERRA_DEV_SITE_BASENAME',
    });
  }

  apply(compiler) {
    const publicPath = compiler.options.output.publicPath || process.env.TERRA_DEV_SITE_PUBLIC_PATH || '/';
    new TerraDevSiteGeneratePlugin({
      sites: this.sites,
      // Strip the trailing / from the public path.
      basename: publicPath.slice(0, -1),
      lang: this.lang,
    }).apply(compiler);
    new TerraDevSiteSetupPlugin({
      publicPath,
    }).apply(compiler);
  }
}

module.exports = TerraDevSitePlugin;
