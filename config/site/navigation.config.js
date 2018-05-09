const navConfig = {
  rootPath: '/site',
  navigation: {
    index: '/site/home',
    links: [{
      path: '/site/home',
      text: 'Home',
      pageType: 'home',
    }, {
      path: '/site/components',
      text: 'Components',
      pageType: 'doc',
    }, {
      path: '/tests',
      text: 'Tests',
      pageType: 'test',
      isHidden: true,
    }],
  },
};

module.exports = navConfig;
