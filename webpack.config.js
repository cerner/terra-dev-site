// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const defaultWebpackConfig = require('./config/webpack/webpack.config');

const coreConfig = () => ({
  resolve: {
    alias: {
      'terra-dev-site': process.cwd(),
    },
  },
});

const mergedConfig = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), coreConfig())
);

module.exports = mergedConfig;
