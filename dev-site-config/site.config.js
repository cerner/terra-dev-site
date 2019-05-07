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
      title:'Browser Router App',
      file: '../src/testAppBrowserRouter/index',
      basename: 'BASENAME',
      rootElementId: 'root',
    },
    {
      path: 'hash',
      title: 'Hash Router App',
      file: '../src/testAppHashRouter/index',
      rootElementId: 'hashroot',
    },
  ],
};

module.exports = siteConfig;
