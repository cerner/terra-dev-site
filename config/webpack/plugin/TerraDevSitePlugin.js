const path = require('path');
const webpack = require('webpack');
const TerraDevSiteSetupPlugin = require('./TerraDevSiteSetupPlugin');
const TerraDevSiteGeneratePlugin = require('./TerraDevSiteGeneratePlugin');
const loadSiteConfig = require('../../../scripts/generate-app-config/loadSiteConfig');

class TerraDevSitePlugin {
  constructor({ env, sites = [] } = {}) {
    this.lang = env.defaultLocale;
    this.sites = sites;
    this.sites.unshift({
      siteConfig: loadSiteConfig(),
      indexPath: path.resolve(path.join(__dirname, '..', '..', '..', 'lib', 'Index')),
    });
  }

  apply(compiler) {
    const publicPath = compiler.options.output.publicPath || process.env.TERRA_DEV_SITE_PUBLIC_PATH || '/';
    const basename = publicPath.slice(0, -1);
    new TerraDevSiteGeneratePlugin({
      sites: this.sites,
      // Strip the trailing / from the public path.
      basename,
      lang: this.lang,
    }).apply(compiler);
    new TerraDevSiteSetupPlugin({
      publicPath,
    }).apply(compiler);
    new webpack.DefinePlugin({
      // Base name is used to namespace terra-dev-site
      TERRA_DEV_SITE_BASENAME: JSON.stringify(basename),
    }).apply(compiler);
  }
}

module.exports = TerraDevSitePlugin;
