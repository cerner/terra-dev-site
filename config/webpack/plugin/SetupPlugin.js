/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeSlug = require('rehype-slug');
const rehypeLink = require('rehype-autolink-headings');
const rehypeToc = require("rehype-toc");

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

    const mdxUse = [{
      loader: 'babel-loader',
      options: {
        rootMode: 'upward', // needed to correctly resolve babel's config root in mono-repos
      },
    },
    {
      loader: '@mdx-js/loader',
      options: {
        rehypePlugins: [
          rehypeSlug,
          [rehypeLink, { properties: {ariaHidden: true, class: 'anchor'} }],
          rehypeToc,
          rehypePrism,
        ],
        // remarkPlugins: [
        //   remarkToc,
        // ],
      },
    }];

    // MODULE
    compiler.options.module.rules.push({
      test: /\.mdx$/,
      use: mdxUse,
    }, {
      issuer: /dev-site-config.*\/contentConfig\.js$/,
      test: /\.md$/,
      enforce: 'pre',
      use: mdxUse,
    });

    // OUTPUT
    compiler.options.output.publicPath = this.publicPath;

    // RESOLVE
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    compiler.options.resolve.modules.unshift(devSiteConfigPath);

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
