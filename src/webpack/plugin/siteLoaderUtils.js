const rehypeSlug = require('rehype-slug');
const rehypeUrl = require('rehype-urls');
const rehypeUrlInspector = require('@jsdevtools/rehype-url-inspector');

const { XMLHttpRequest } = require('xmlhttprequest');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    rootMode: 'upward', // needed to correctly resolve babel's config root in mono-repos
  },
};

const getMdxLoader = (publicPath) => ({
  loader: '@mdx-js/loader',
  options: {
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
      [rehypeUrlInspector, {
        inspectEach: (url) => {
          if ((url.url.includes('https') || url.url.includes('http')) && !url.file.history[0].includes('node_modules')) {
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', url.url, false);
            xmlHttp.onloadend = () => {
              if (xmlHttp.status === 404 && new RegExp(/Not Found/gi).test(xmlHttp.responseText)) {
                console.warn('Warning! Broken Link', url.url, 'in', url.file.history[0], 'at line:', url.node.position.start.line);
              }
            };
            xmlHttp.send(null);
            setTimeout(() => xmlHttp.abort(), 10);
          }
        },
      }],
    ],
  },
});

module.exports = {
  babelLoader,
  getMdxLoader,
};
