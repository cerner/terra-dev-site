
const merge = require('webpack-merge');
const terraDevSiteConfig = require('./terra-dev-site.config');

const defaultWebpackConfig = require('terra-toolkit/lib/webpack/webpack.config');

const mergedConfig = merge.strategy(
  {
    'resolve.modules': 'prepend',
  },
)(defaultWebpackConfig, terraDevSiteConfig);

module.exports = mergedConfig;
