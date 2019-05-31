const wdioConf = require('terra-toolkit/config/wdio/wdio.conf');
const webpackConfig = require('../webpack/webpack.config');

const config = {
  ...wdioConf.config,

  webpackConfig,

  terra: {
    selector: '[data-terra-dev-site-content] *:first-child',
  },
};

exports.config = config;
