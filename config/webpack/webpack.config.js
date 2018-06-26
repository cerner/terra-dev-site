// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const terraDevSiteConfig = require('./terra-dev-site.webpack.config');

const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');

const mergedConfig = (env, argv) => (
  merge.strategy({
    'resolve.modules': 'prepend',
  })(defaultWebpackConfig(env, argv), terraDevSiteConfig(env, argv))
);

module.exports = mergedConfig;
