const navConfig = {
  rootPath: '/dev-site',
  navigation: {
    index: '/dev-site/home',
    links: [{
      path: '/dev-site/home',
      text: 'Home',
      pageType: 'home',
    }, {
      path: '/dev-site/getting-started',
      text: 'Getting Started',
      pageType: 'docs',
      isHidden: true,
    }],
  },
};

module.exports = navConfig;
