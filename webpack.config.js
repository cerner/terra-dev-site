const path = require('path');
const defaultWebpackConfig = require('./config/webpack/webpack.config');
const loadSiteConfig = require('./scripts/generate-app-config/loadSiteConfig');
const TerraDevSite = require('./config/webpack/plugin/TerraDevSite');

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = {}) => {
  const config = defaultWebpackConfig(env, argv);
  // Load the site configuration.
  const siteConfig = loadSiteConfig();

  siteConfig.appConfig = {
    ...siteConfig.appConfig,
    subline: 'Extended',
  };

  return {
    ...config,
    plugins: config.plugins.slice(0, -1).concat([
      new TerraDevSite({
        env,
        sites: [{
          siteConfig,
          prefix: 'terra-application',
          indexPath: path.resolve(path.join(__dirname, 'lib', 'ExtendDevSite')),
        }],
      }),
    ]),
  };
};

module.exports = devSiteConfig;
