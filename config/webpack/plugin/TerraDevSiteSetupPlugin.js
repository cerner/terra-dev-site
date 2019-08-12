/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

class TerraDevSitePlugin {
  constructor({ publicPath } = {}) {
    this.publicPath = publicPath;
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    // Load the site configuration.
    const production = compiler.options.mode === 'production';
    const processPath = process.cwd();

    // OUTPUT
    compiler.options.output.publicPath = this.publicPath;

    // RESOLVE
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    compiler.options.resolve.modules.push([devSiteConfigPath]);

    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(__dirname, '..', '..', 'lib', '404.html'),
      inject: 'head',
      chunks: ['redirect'],
    }).apply(compiler);

    // WEBPACK DEV SERVER
    compiler.options.devServer.historyApiFallback = true;

    // DEVTOOL
    if (production) {
      compiler.options.devtool = 'source-map';
    }
  }
}

module.exports = TerraDevSitePlugin;
