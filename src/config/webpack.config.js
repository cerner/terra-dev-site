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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const I18nAggregatorPlugin = require('terra-i18n-plugin');
// const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');
const fs = require('fs');

const isFile = filePath => (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory());

const processPath = process.cwd();
/* Get the root path of a mono-repo process call */
const rootPath = processPath.includes('packages') ? processPath.split('packages')[0] : processPath;

/* Get the site configuration to define as SITE_CONFIG in the DefinePlugin */
let siteConfigPath = path.resolve(path.join(rootPath, 'site.config.js'));
// eslint-disable-next-line import/no-dynamic-require
siteConfigPath = isFile(siteConfigPath) ? siteConfigPath : './config/site.config';

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
      use: [
        MiniCssExtractPlugin.loader,
        // { loader: 'style-loader' },
        {
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
        }, {
          loader: 'sass-loader',
          options: {
            data: '$bundled-themes: mock;',
          },
        },
        // { loader: 'style-loader' },
      ],
    },
    {
      test: /\.md$/,
      use: 'raw-loader',
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: 'file-loader',
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Site',
      template: path.join(__dirname, '..', 'index.html'),
    }),
    // new I18nAggregatorPlugin({
    //   baseDirectory: rootPath,
    //   supportedLocales: i18nSupportedLocales,
    // }),
    new webpack.DefinePlugin({
      SITE_CONFIG_PATH: JSON.stringify(siteConfigPath),
    }),
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      log: false,
      plugins: [
        PostCSSCustomProperties({ preserve: true }),
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(rootPath, 'aggregated-translations'), 'node_modules'],

    // See https://github.com/facebook/react/issues/8026
    alias: {
      react: path.resolve(rootPath, 'node_modules', 'react'),
      'react-intl': path.resolve(rootPath, 'node_modules', 'react-intl'),
      'react-dom': path.resolve(rootPath, 'node_modules', 'react-dom'),
    },
  },
  output: {
  //   filename: '[name].js',
    path: path.join(rootPath, 'build'),
  },
  devtool: 'cheap-module-eval-source-map',
  resolveLoader: {
    modules: [path.resolve(path.join(rootPath, 'node_modules'))],
  },
  mode: 'development',
};

module.exports = defaultWebpackConfig;
