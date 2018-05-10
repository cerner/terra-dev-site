const navConfig = {
  rootPath: '/dev-site',
  navigation: {
    index: '/dev-site/home',
    links: [{
      path: '/dev-site/home',
      text: 'Home',
      pageTypes: ['home'],
    }, {
      path: '/dev-site/getting-started',
      text: 'Getting Started',
      pageTypes: ['docs'],
    }],
  },
};

module.exports = navConfig;
