const fs = require('fs');
const navConfig = require('./navigation.config');

const html = fs.readFileSync(require.resolve('./head.html'), 'utf8');

const siteConfig = {
  navConfig,

  appConfig: {
    locales: ['en', 'es', 'en-US'],
    bidirectional: true,

    headHtml: [
      '<script> console.log("Terra Dev Site Derp") </script>',
      html,
    ],
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
