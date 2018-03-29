// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */
const webpackConfig = require('./webpack.config');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

// Clean build before running
webpackConfig.plugins.push(new CleanPlugin('build', { exclude: ['stats.json'] }));

// Create output file
webpackConfig.output = {
  path: path.resolve('build'),
  filename: '[name]-[hash].js',
};
webpackConfig.mode = 'production';
webpackConfig.devtool = undefined;

webpackConfig.optimization = {
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true, // set to true if you want JS source maps
    }),
    new OptimizeCSSAssetsPlugin({}),
  ],
};

module.exports = webpackConfig;
