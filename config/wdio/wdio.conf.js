const wdioConf = require('terra-toolkit/config/wdio/wdio.conf');
const webpackConfig = require('../webpack/webpack.config');

const config = {
  ...wdioConf.config,

  webpackConfig,

  terra: {
    selector: '[data-terra-dev-site-content] *:first-child',
  },

  axe: {
    inject: true,
    options: {
      rules: [
        { id: 'landmark-one-main', enabled: false },
        { id: 'page-has-heading-one', enabled: false },
        { id: 'region', enabled: false },
      ],
    },
  },
};

exports.config = config;
