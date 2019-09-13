/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');

/**
 * Determine if the path resolves to a file.
 */
const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());


/**
 * Updates the webpack options with defaults that terra-dev-site requires.
 */
class SetupPlugin {
  constructor({ publicPath, includePropsTableLoader } = {}) {
    this.publicPath = publicPath;
    this.includePropsTableLoader = includePropsTableLoader;
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

    if (this.includePropsTableLoader) {
      if (!compiler.options.node) {
        compiler.options.node = {};
      }

      if (!compiler.options.node.fs) {
        compiler.options.node.fs = {};
      }
      compiler.options.node.fs = 'empty';

      // Resolve version of react-docgen defined with terra-dev-site
      if (!compiler.options.resolve.alias) {
        compiler.options.resolve.alias = {};
      }

      const getReactDocgenLocation = () => {
        let reactDocgenPath = path.resolve(process.cwd(), 'node_modules', 'react-docgen');
        /**
         * Check if there is another version of react-docgen that is installed in the root node_modules
         * This can happen if multiple versions of react-docgen are in the dependency tree
         * In that case, we want to resolve the one associated with terra-dev-site
         */
        if (isFile(path.resolve(process.cwd(), 'node_modules', 'terra-dev-site', 'node_modules', 'react-docgen', 'package.json'))) {
          reactDocgenPath = path.resolve(process.cwd(), 'node_modules', 'terra-dev-site', 'node_modules', 'react-docgen');
        }

        return reactDocgenPath;
      };

      compiler.options.resolve.alias['react-docgen'] = getReactDocgenLocation();

      // Resolve custom react-docgen based props-table-loader
      if (!compiler.options.resolveLoader.alias) {
        compiler.options.resolveLoader.alias = {};
      }
      compiler.options.resolveLoader.alias['terra-props-table-loader'] = path.join(__dirname, '..', 'loaders', 'terra-props-table-loader');
    }

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
