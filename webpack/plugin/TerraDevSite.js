const path = require('path');
const SitePlugin = require('./SitePlugin');
const applyDefaults = require('./applyDefaults');

// const validate = (sites) => {
//   sites.forEach((site) => {
//     let exit = false;
//     if (!site.configFileName && !site.siteConfig) {
//       // eslint-disable-next-line no-console
//       console.error('Site missing config. either the configFileName or the siteConfig string');
//       exit = true;
//     }
//     if (!site.prefix) {
//       // eslint-disable-next-line no-console
//       console.error('Site missing prefix. A unique prefix must be added to the site.');
//       exit = true;
//     }
//     if (!site.indexPath) {
//       // eslint-disable-next-line no-console
//       console.error('Site missing indexPath. A valid path to the entry javascript file must be included.');
//       exit = true;
//     }
//     if (exit) {
//       process.exit(0);
//     }
//   });
// };
/**
 * Generate a terra-dev-site
 */
class TerraDevSite {
  constructor(config = {}) {
    this.config = config;
    this.sitePlugin = new SitePlugin({
      config: this.config,
      applyDefaults,
      indexPath: path.resolve(__dirname, '..', '..', 'src', 'TerraDevSite'),
    });
  }

  apply(compiler) {
    this.sitePlugin.apply(compiler);
  }
}

module.exports = TerraDevSite;
