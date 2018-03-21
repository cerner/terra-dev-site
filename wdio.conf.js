/* eslint-disable import/no-extraneous-dependencies */
const wdioConf = require('terra-toolkit/lib/wdio/conf');
const ExpressDevService = require('terra-toolkit/lib/wdio/services/index').ExpressDevService;
const localIP = require('ip');
const webpackConfig = require('./src/config/webpack.config');

const config = {
  ...wdioConf.config,

  baseUrl: `http://${localIP.address()}:${8080}`,

  // Configuration for ExpressDevService
  webpackConfig,

  // Travis only has 1 browser instace, set maxInstances to 1 to prevent timeouts
  maxInstances: process.env.CI ? 1 : wdioConf.config.maxInstances,

  // Configuration for terra-toolkit's SeleniumDocker service
  seleniumDocker: {
    enabled: !process.env.TRAVIS,
  },

  // Testing component accessiblity, not applciation-level accessiblity so disable landmark-one-main rule
  axe: {
    inject: true,
    options: {
      rules: [{
        id: 'landmark-one-main',
        enabled: false,
      }],
    },
  },

  // Configuration for TerraService
  terra: {
    selector: '[data-terra-dev-site-content] *:first-child',
  },

  beforeHook() {
    // Being Terra tests are executed on an SPA, a full refresh is required
    // in order to reset the site. This ensures customProperty tests and any
    // other dom modifications are cleared before starting a test.
    global.browser.refresh();
  },
};

config.services = wdioConf.config.services.concat([ExpressDevService]);
exports.config = config;
