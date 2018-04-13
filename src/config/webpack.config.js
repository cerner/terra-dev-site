// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const Autoprefixer = require('autoprefixer');
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const path = require('path');
const rtl = require('postcss-rtl');
const ThemingPlugin = require('../theming-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const aggregateTranslations = require('terra-i18n/scripts/aggregate-translations/aggregate-translations');
const fs = require('fs');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const processPath = process.cwd();
/* Get the root path of a mono-repo process call */
const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

aggregateTranslations({ baseDirectory: rootPath });

const customSiteConfigPath = path.join(rootPath, 'site.config.js');
const devSiteConfigPath = isFile(customSiteConfigPath) ? rootPath : path.join('src', 'config');

const defaultWebpackConfig = {
  entry: {
    raf: 'raf/polyfill',
    'babel-polyfill': 'babel-polyfill',
    'terra-dev-site': path.resolve(path.join(__dirname, '..', 'Index')),
  },
  module: {
    rules: [{
      test: /\.(jsx|js)$/,
      exclude: /node_modules(?!\/terra-dev-site\/src)/,
      use: 'babel-loader',
    },
    {
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true,
            importLoaders: 2,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins() {
              return [
                Autoprefixer({
                  browsers: [
                    'ie >= 10',
                    'last 2 versions',
                    'last 2 android versions',
                    'last 2 and_chr versions',
                    'iOS >= 10',
                  ],
                }),
                ThemingPlugin,
                rtl(),
              ];
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            data: '$bundled-themes: mock;',
          },
        }],
      }),
    },
    {
      test: /\.md$/,
      use: 'raw-loader',
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: 'file-loader',
    },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new HtmlWebpackPlugin({
      title: 'Site',
      template: path.join(__dirname, '..', 'index.html'),
      chunks: ['raf', 'babel-polyfill', 'terra-dev-site'],
    }),
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      log: false,
      plugins: [
        PostCSSCustomProperties({ preserve: true }),
      ],
    }),
    new webpack.NamedChunksPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [devSiteConfigPath, path.resolve(rootPath, 'aggregated-translations'), 'node_modules'],

    // See https://github.com/facebook/react/issues/8026
    alias: {
      react: path.resolve(rootPath, 'node_modules', 'react'),
      'react-intl': path.resolve(rootPath, 'node_modules', 'react-intl'),
      'react-dom': path.resolve(rootPath, 'node_modules', 'react-dom'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.join(rootPath, 'dist'),
  },
  devtool: 'cheap-source-map',
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: true,
      warnings: true,
    },
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  resolveLoader: {
    modules: [path.resolve(path.join(rootPath, 'node_modules'))],
  },
};

module.exports = defaultWebpackConfig;
