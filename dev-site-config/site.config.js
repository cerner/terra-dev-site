const fs = require('fs');
const navConfig = require('./navigation.config');

const html = fs.readFileSync(require.resolve('./head.html'), 'utf8');

const siteConfig = {
  navConfig,

  appConfig: {
    // locales: ['en'],
    bidirectional: true,

    headHtml: [
      '<script> console.log("Inline head html script") </script>',
      html,
    ],

    themes: {
      'Default Theme': '',
      'Terra Dev Site Test Theme': 'terra-dev-site-test-theme',
    },

    pageTypeCapabilities: {
      doc: {
        disableComponentToolbar: true,
      },
    },
  },

  includeTestEvidence: false,

  filterSideMenu: true,

  apps: [
    {
      path: 'browser',
      title: 'Browser Router App',
      file: '../lib/testAppBrowserRouter/index',
      basename: 'BASENAME',
    },
    {
      path: 'hash',
      title: 'Hash Router App',
      file: '../lib/testAppHashRouter/index',
      rootElementId: 'hashroot',
    },
  ],
};

module.exports = siteConfig;
