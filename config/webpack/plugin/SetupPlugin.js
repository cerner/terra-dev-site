/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeSlug = require('rehype-slug');
const rehypeLink = require('rehype-autolink-headings');
const rehypeAddClasses = require('rehype-add-classes');
// const rehypeToc = require("rehype-toc");

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
          [rehypeLink, {
            properties: { ariaHidden: true, class: 'anchor' },
          }],
          rehypePrism,
          [rehypeAddClasses, {
            a: 'terra-dev-site-a',
            blockquote: 'terra-dev-site-blockquote',
            code: 'terra-dev-site-code',
            dd: 'terra-dev-site-dd',
            dl: 'terra-dev-site-dl',
            dt: 'terra-dev-site-dt',
            h1: 'terra-dev-site-h1',
            h2: 'terra-dev-site-h2',
            h3: 'terra-dev-site-h3',
            h4: 'terra-dev-site-h4',
            h5: 'terra-dev-site-h5',
            h6: 'terra-dev-site-h6',
            hr: 'terra-dev-site-hr',
            img: 'terra-dev-site-img',
            input: 'terra-dev-site-input',
            kbd: 'terra-dev-site-kbd',
            li: 'terra-dev-site-li',
            ol: 'terra-dev-site-ol',
            p: 'terra-dev-site-p',
            pre: 'terra-dev-site-pre',
            strong: 'terra-dev-site-strong',
            table: 'terra-dev-site-table',
            td: 'terra-dev-site-td',
            th: 'terra-dev-site-th',
            tr: 'terra-dev-site-tr',
            ul: 'terra-dev-site-ul',
          }],
        ],
        // remarkPlugins: [
        // ],
      },
    }];

    // MODULE
    // Remove raw markdown rule if found.
    const mdIndex = compiler.options.module.rules.findIndex((rule) => rule.test.toString && rule.test.toString() === '/\\.md$/');
    if (mdIndex > -1) {
      compiler.options.module.rules.splice(mdIndex, 1);
    }

    compiler.options.module.rules.push({
      test: /\.mdx$/,
      use: mdxUse,
    }, {
      test: /\.md$/,
      oneOf: [
        {
          // To preserve previous behaviour, we will only apply mdx to requests issued
          // from either the content config files or from .md or .mdx files
          issuer: [
            /dev-site-config.*\/contentConfig\.js$/,
            /\.mdx?$/,
          ],
          use: mdxUse,
        },
        {
          use: 'raw-loader',
        },
      ],
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
