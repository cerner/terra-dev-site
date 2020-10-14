/* eslint-disable no-param-reassign */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
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
    const processPath = process.cwd();

    // MODULE

    const mdxLoader = getMdxLoader(this.publicPath);

    compiler.options.module.rules = [{
      // Drop loaders in a 'one of' block to avoid the original loaders applying on top of the new loaders.
      // Only the first loader will apply and no others.
      oneOf: [{
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
          {
            loader: 'devSiteCodeblock',
            options: {
              resolveExtensions: compiler.options.resolve.extensions,
            },
          },
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
              resolveExtensions: compiler.options.resolve.extensions,
            },
          },
        ],
      },
      // Spread the original loaders. These will be applied if all above loaders fail.
      ...compiler.options.module.rules,
      ],
    },
    ];

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
  }
}

module.exports = SetupPlugin;
