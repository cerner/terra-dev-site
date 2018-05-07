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
      pageType: 'component',
      hasSubNav: true,
    }, {
      path: '/tests',
      text: 'Tests',
      pageType: 'test',
      hasSubNav: true,
    }],
  },
};

module.exports = navConfig;
