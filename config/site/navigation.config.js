const navConfig = {
  rootPath: '/site',
  navigation: {
    index: '/site/home',
    links: [{
      path: '/site/home',
      text: 'Home',
      pageTypes: ['home'],
    }, {
      path: '/site/components',
      text: 'Components',
      pageTypes: ['doc'],
    }, {
      path: '/tests',
      text: 'Tests',
      pageTypes: ['test'],
      isHidden: true,
    }],
  },
};

module.exports = navConfig;
