/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const rehypePrism = require('@mapbox/rehype-prism');
const rehypeSlug = require('rehype-slug');
const rehypeUrl = require('rehype-urls');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    rootMode: 'upward', // needed to correctly resolve babel's config root in mono-repos
  },
};

const mdxOptions = (publicPath) => ({
  rehypePlugins: [
    // Add id's to h-tags
    rehypeSlug,
    // Don't fail on missing languages
    [rehypePrism, { ignoreMissing: true }],
    [rehypeUrl, (url) => {
      // Re-write relative urls to include public path.
      if (!url.protocol && url.pathname && url.pathname.startsWith('/') && publicPath.length > 1) {
        // Remove the first slash from the url.pathname because publicPath always ends with one.
        return `${publicPath}${url.pathname.slice(1)}`;
      }
      return url.href;
    }],
  ],
});

const getMdxLoader = (publicPath) => ({
  loader: '@mdx-js/loader',
  options: mdxOptions(publicPath),
});

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

    // MODULE
    // Remove raw markdown rule if found.
    const mdIndex = compiler.options.module.rules.findIndex((rule) => rule.test.toString && rule.test.toString() === '/\\.md$/');
    if (mdIndex > -1) {
      compiler.options.module.rules.splice(mdIndex, 1);
    }

    const mdxLoader = getMdxLoader(this.publicPath);

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
          // Use MDX to import any md files imported from an mdx file.
          issuer: [
            /\.mdx?$/,
          ],
          use: [
            babelLoader,
            mdxLoader,
          ],
        },
        {
          // Use the marked loader to load any md files included by the content config file.
          // LOAD USING MDX ON NEXT MAJOR VERSION.
          issuer: [
            /dev-site-config.*[/\\]contentConfig\.js$/,
          ],
          use: [
            babelLoader,
            {
              loader: 'devSiteMarked',
              options: {
                baseUrl: this.publicPath,
              },
            },
          ],
        },
        {
          use: 'raw-loader',
        },
      ],
    }, {
      resourceQuery: /dev-site-codeblock/,
      // this bypasses the default json loader
      type: 'javascript/auto',
      use: [
        babelLoader,
        mdxLoader,
        'devSiteCodeblock',
      ],
    }, {
      resourceQuery: /dev-site-example/,
      use: [
        babelLoader,
        'devSiteExample',
      ],
    }, {
      test: /\.json$/,
      // this bypasses the default json loader
      type: 'javascript/auto',
      resourceQuery: /dev-site-package/,
      use: [
        babelLoader,
        'devSitePackage',
      ],
    }, {
      resourceQuery: /dev-site-props-table/,
      use: [
        babelLoader,
        {
          loader: 'devSitePropsTable',
          options: {
            mdx: mdxOptions(this.publicPath),
          },
        },
      ],
    });

    // OUTPUT
    compiler.options.output.publicPath = this.publicPath;

    // RESOLVE
    const devSiteConfigPath = path.resolve(path.join(processPath, 'dev-site-config'));
    compiler.options.resolve.modules.unshift(devSiteConfigPath);

    // RESOLVE LOADER
    // add the path to search for dev site loaders
    compiler.options.resolveLoader.modules = [
      path.resolve(__dirname, '..', 'loaders'),
      'node_modules',
    ];

    // generate the 404 page.
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
