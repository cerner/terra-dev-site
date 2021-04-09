// eslint-disable-next-line import/no-extraneous-dependencies
const { config } = require('@cerner/terra-functional-testing');

config.specs = [
  './tests/wdio/*-spec.js',
];

config.suites = {
  de: [
    './tests/wdio/de/*-spec.js',
  ],
};

exports.config = config;
