const SitePlugin = require('./SitePlugin');
const applyDefaults = require('./applyDefaults');

/**
 * Generate a terra-dev-site
 */
class TerraDevSite {
  constructor(config = {}) {
    this.sitePlugin = new SitePlugin({
      config: applyDefaults(config),
      entry: '@cerner/terra-dev-site/lib/site',
      contentDirectory: 'terra-dev-site',
    });
  }

  apply(compiler) {
    this.sitePlugin.apply(compiler);
  }
}

module.exports = TerraDevSite;
