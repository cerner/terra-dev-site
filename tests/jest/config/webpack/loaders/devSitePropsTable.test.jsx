import 'regenerator-runtime/runtime';
// eslint-disable-next-line no-unused-vars
// path.resolve(__dirname, '../../../../../src/terra-dev-site/test/loaders/PropsTableExample.jsx')
// ('/Users/dm068655/Documents/terra-dev-site/lib/terra-dev-site/test/loaders/PropsTableExample.js');
// path.resolve(__dirname, '../../../../../config/webpack/loaders/devSitePropsTable')
// /Users/dm068655/Documents/terra-dev-site/tests/jest/config/webpack/loaders/PropsTableExample2.jsx

jest.mock('');
const path = require('path');
const { runLoaders } = require('loader-runner');
const rehypeSlug = require('rehype-slug');
const rehypeUrl = require('rehype-urls');

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

// const source = '/Users/dm068655/Documents/terra-dev-site/src/terra-dev-site/test/loaders/PropsTableExample';

describe('devSitePropsTable test', () => {
  it('when the propsTable lib file does not match the source file', (done) => {
    runLoaders({
      resource: path.resolve(__dirname, './PropsTableExample2.jsx'),
      loader: '/Users/dm068655/Documents/terra-dev-site/config/webpack/loaders/devSitePropsTable',
      options: {
        mdx: mdxOptions('/'),
        resolveExtensions: '.js,.jsx,.jst',
      },
    }, (err, result) => {
      if (err) return done(err);
      // expect(result.result[0]).toEqual(`A non transpiled source file is required for the props table to be generated:\n${source}\n${err}`);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });
});
