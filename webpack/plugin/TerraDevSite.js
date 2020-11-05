const path = require('path');
const SitePlugin = require('./SitePlugin');
const applyDefaults = require('./applyDefaults');

/**
 * Generate a terra-dev-site
 */
class TerraDevSite {
  constructor(config = {}) {
    this.config = config;
    this.sitePlugin = new SitePlugin({
      config: this.config,
      applyDefaults,
      entry: path.resolve(__dirname, '..', '..', 'lib', 'site', 'Site'),
      contentDirectory: 'terra-dev-site',
    });
  }

  apply(compiler) {
    this.sitePlugin.apply(compiler);
  }
}

module.exports = TerraDevSite;
