// eslint-disable-next-line import/no-extraneous-dependencies
const defaultWdioConfig = require('terra-toolkit/config/wdio/wdio.conf');

const wdioConfig = defaultWdioConfig.config;

const travis = process.env.TRAVIS;

if (travis) {
  wdioConfig.host = 'localhost';
}

exports.config = wdioConfig;
