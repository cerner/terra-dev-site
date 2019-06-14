const navConfig = {
  navigation: {
    index: '/home',
    links: [{
      path: '/home',
      text: 'Home',
      pageTypes: ['home'],
    }, {
      path: '/getting-started',
      text: 'Getting Started',
      pageTypes: ['doc'],
    }, {
      path: '/single-page-test',
      text: 'Single Page Test',
      pageTypes: ['spt'],
      capabilities: {
        devToolbar: true,
      },
    }, {
      path: '/secondary-nav-test',
      text: 'Secondary Nav Test',
      pageTypes: ['snt'],
      capabilities: {
        devToolbar: true,
      },
    }, {
      path: '/folder first',
      text: 'Folder First Test',
      pageTypes: ['ff'],
      capabilities: {
        devToolbar: true,
      },
    }],
  },
};

module.exports = navConfig;
