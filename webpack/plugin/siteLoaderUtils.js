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

module.exports = {
  babelLoader,
  mdxOptions,
  getMdxLoader,
};
