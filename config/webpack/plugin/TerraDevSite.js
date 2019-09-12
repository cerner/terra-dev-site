const path = require('path');
const { DefinePlugin } = require('webpack');
const SetupPlugin = require('./SetupPlugin');
const GeneratePlugin = require('./GeneratePlugin');
const loadSiteConfig = require('../../../scripts/generate-app-config/loadSiteConfig');

const validate = (sites) => {
  sites.forEach((site) => {
    let exit = false;
    if (!(site.configFileName && site.defaultConfigPath) && !site.siteConfig) {
      // eslint-disable-next-line no-console
      console.error('Site missing config. either the configFileName and the default configPath or the siteConfig string');
      exit = true;
    }
    if (!site.prefix) {
      // eslint-disable-next-line no-console
      console.error('Site missing prefix. A unique prefix must be added to the site.');
      exit = true;
    }
    if (!site.indexPath) {
      // eslint-disable-next-line no-console
      console.error('Site missing indexPath. A valid path to the entry javascript file must be included.');
      exit = true;
    }
    if (exit) {
      process.exit(0);
    }
  });
};
/**
 * Generate a terra-dev-site
 */
class TerraDevSite {
  constructor({ env = {}, sites = [] } = {}) {
    // Validate sites.
    validate(sites);
    // Sites to generate. Add the default site then load the config if not present
    this.sites = [
      {
        configFileName: 'site.config.js',
        defaultConfigPath: path.resolve(__dirname, '..', '..', 'site', 'site.config.js'),
        indexPath: path.resolve(__dirname, '..', '..', '..', 'lib', 'TerraDevSite'),
      },
      ...sites,
    ].map((site) => {
      // load config if siteConfig is not already defined.
      const siteConfig = site.siteConfig || loadSiteConfig(site.configFileName, site.defaultConfigPath);
      const locale = env.defaultLocale;
      if (locale) {
        siteConfig.appConfig.defaultLocale = locale;
      }
      return ({
        ...site,
        siteConfig,
      });
    });
  }

  apply(compiler) {
    // Use default public path else the env else /
    let defaultPublicPath;
    if (compiler.options.output && compiler.options.output.publicPath) {
      defaultPublicPath = compiler.options.output.publicPath;
    }
    const publicPath = defaultPublicPath || process.env.TERRA_DEV_SITE_PUBLIC_PATH || '/';

    // Strip the trailing / from the public path.
    const basename = publicPath.slice(0, -1);
    new GeneratePlugin({
      sites: this.sites,
      basename,
    }).apply(compiler);
    new SetupPlugin({
      publicPath,
    }).apply(compiler);
    new DefinePlugin({
      // Base name is used to namespace terra-dev-site this is used in redirect.js which is only used in the 404 page.
      TERRA_DEV_SITE_BASENAME: JSON.stringify(basename),
    }).apply(compiler);
  }
}

module.exports = TerraDevSite;
