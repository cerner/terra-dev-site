const path = require('path');
const defaultWebpackConfig = require('./config/webpack/webpack.config');
const TerraDevSite = require('./config/webpack/plugin/TerraDevSite');

/**
* Generates the file representing app name configuration.
*/
const devSiteConfig = (env = {}, argv = {}) => {
  const config = defaultWebpackConfig(env, argv);
  // Load the site configuration.

  config.resolve.extensions = ['.js', '.jsx', '.jst'];
  // config.resolve.alias = { devSiteConfig: '' };
  // config.resolve.alias = { devSiteConfig: path.resolve(__dirname, 'README.md') };
  // Brittle
  config.module.rules[0].test = /\.(jsx|js|jst)$/;

  return {
    ...config,
    plugins: config.plugins.slice(0, -1).concat([
      new TerraDevSite({
        env,
        sites: [{
          configFileName: 'extend-dev-site.config.js',
          prefix: 'terra-application',
          indexPath: path.resolve(path.join(__dirname, 'lib', 'ExtendDevSite')),
        }],
      }),
    ]),
  };
};

module.exports = devSiteConfig;
