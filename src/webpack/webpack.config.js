
const merge = require('webpack-merge');
const terraDevSiteConfig = require('./terra-dev-site.config');

const defaultWebpackConfig = require('terra-toolkit/lib/webpack/webpack.config');

const mergedConfig = (env, argv) => (
  merge.strategy(
    {
      'resolve.modules': 'prepend',
    },
  )(defaultWebpackConfig(env, argv), terraDevSiteConfig(env, argv))
);

module.exports = mergedConfig;
