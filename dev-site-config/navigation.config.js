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
    }, {
      path: '/secondary-nav-test',
      text: 'Secondary Nav Test',
      pageTypes: ['snt'],
    }],
  },
};

module.exports = navConfig;
