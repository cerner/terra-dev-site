const wdioConf = require('terra-toolkit/config/wdio/wdio.conf');
const webpackConfig = require('../webpack/webpack.config');

const config = {
  ...wdioConf.config,

  webpackConfig,

  terra: {
    selector: '[data-terra-dev-site-content] *:first-child',
  },

  // beforeHook() {
  //   // Being Terra tests are executed on an SPA, a full refresh is required
  //   // in order to reset the site. This ensures customProperty tests and any
  //   // other dom modifications are cleared before starting a test.
  //   global.browser.refresh();
  // },
};

exports.config = config;
