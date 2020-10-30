const fs = require('fs');

const html = fs.readFileSync(require.resolve('./head.html'), 'utf8');

const siteConfig = {
  navigation: {
    index: '/home',
    primaryNavigationItems: [{
      path: '/home',
      text: 'Home',
      pageType: 'home',
    }, {
      path: '/dev_tools',
      text: 'Developer Tools',
      pageType: 'tool',
    }, {
      path: '/single-page-test',
      text: 'Single Page Test',
      pageType: 'spt',
    }, {
      path: '/secondary-nav-test',
      text: 'Secondary Nav Test',
      pageType: 'snt',
    }, {
      path: '/folder-first',
      text: 'Folder First Test',
      pageType: 'ff',
    }, {
      path: '/empty',
      text: 'Empty',
      pageType: 'empty',
    }, {
      path: '/test',
      text: 'Test',
      pageType: 'test',
    }],
  },

  appConfig: {
    headHtml: [
      '<script> console.log("Inline head html script") </script>',
      html,
    ],

    extensions: [
      {
        iconPath: 'terra-icon/lib/icon/IconAllergy',
        key: 'terra-dev-site.test-extension',
        text: 'Test Extension',
        modalPath: '@cerner/terra-dev-site/lib/test-extension/TestExtension',
      },
    ],
  },
};

module.exports = siteConfig;
