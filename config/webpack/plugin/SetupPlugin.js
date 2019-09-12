/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/**
 * Updates the webpack options with defaults that terra-dev-site requires.
 */
class SetupPlugin {
  constructor({ publicPath } = {}) {
    this.publicPath = publicPath;
  }

  apply(compiler) {
    // Load the site configuration.
    const production = compiler.options.mode === 'production';
    const processPath = process.cwd();

    // OUTPUT
    compiler.options.output.publicPath = this.publicPath;

    // RESOLVE
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    compiler.options.resolve.modules.unshift(devSiteConfigPath);
    const terraPropsTableLoader = { 'terra-props-table-loader': path.join(__dirname, '..', 'loaders', 'terra-props-table-loader') };
    const alias = compiler.options.resolveLoader.alias
      ? Object.assign(compiler.options.resolveLoader.alias, { 'terra-props-table-loader': path.join(__dirname, '..', 'loaders', 'terra-props-table-loader') })
      : Object.assign({}, terraPropsTableLoader); // eslint-disable-line prefer-object-spread

        if (!compiler.options.resolveLoader.alias) {
      compiler.options.resolveLoader.alias = {};
    }
    compiler.options.resolveLoader.alias['terra-props-table-loader'] = path.join(__dirname, '..', 'loaders', 'terra-props-table-loader');

    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(__dirname, '..', '..', '..', 'lib', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    }).apply(compiler);

    // WEBPACK DEV SERVER
    if (compiler.options.devServer) {
      compiler.options.devServer.historyApiFallback = true;
    }

    // DEVTOOL
    if (production && !compiler.options.devtool) {
      compiler.options.devtool = 'source-map';
    }
  }
}

module.exports = SetupPlugin;
