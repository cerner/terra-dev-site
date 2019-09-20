/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeSlug = require('rehype-slug');
const rehypeUrl = require('rehype-urls');

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

    const babelLoader = {
      loader: 'babel-loader',
      options: {
        rootMode: 'upward', // needed to correctly resolve babel's config root in mono-repos
      },
    };
    const mdxLoader = {
      loader: '@mdx-js/loader',
      options: {
        rehypePlugins: [
          rehypeSlug,
          [rehypePrism, { ignoreMissing: true }],
          [rehypeUrl, (url) => {
            // Re-write relative urls to include public path.
            if (!url.protocol && url.pathname && url.pathname.startsWith('/')) {
              return `${this.publicPath}${url.pathname}`;
            }
            return url.href;
          }],
        ],

      },
    };

    // MODULE
    // Remove raw markdown rule if found.
    const mdIndex = compiler.options.module.rules.findIndex((rule) => rule.test.toString && rule.test.toString() === '/\\.md$/');
    if (mdIndex > -1) {
      compiler.options.module.rules.splice(mdIndex, 1);
    }

    compiler.options.module.rules.push({
      test: /\.mdx$/,
      use: [
        babelLoader,
        mdxLoader,
      ],
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
          use: [
            babelLoader,
            mdxLoader,
          ],
        },
        {
          use: 'raw-loader',
        },
      ],
    }, {
      test: /\.jsx?$/,
      resourceQuery: /codeblock/,
      use: [
        babelLoader,
        mdxLoader,
        'codeblockLoader',
      ],
    }, {
      test: /\.jsx?$/,
      resourceQuery: /example/,
      use: [
        babelLoader,
        'exampleLoader',
      ],
    }, {
      test: /\.json$/,
      type: 'javascript/auto',
      resourceQuery: /dev-site-package/,
      use: [
        babelLoader,
        'packageLoader',
      ],
    });

    // OUTPUT
    compiler.options.output.publicPath = this.publicPath;

    // RESOLVE
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    compiler.options.resolve.modules.unshift(devSiteConfigPath);

    compiler.options.resolveLoader.modules = [
      'node_modules',
      path.resolve(__dirname, '..', 'loaders'),
    ];

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
