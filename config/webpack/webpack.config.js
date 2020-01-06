const merge = require('webpack-merge');
const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');
const terraDevSiteConfig = require('./terra-dev-site.webpack.config');

const mergedConfig = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), terraDevSiteConfig(env, argv))
);

module.exports = mergedConfig;
