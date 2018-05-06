const navConfig = {
  rootPath: '/site',
  navigation: {
    index: '/site/home',
    links: [{
      path: '/site/home',
      text: 'Home',
      exampleType: 'home',
    }, {
      path: '/site/components',
      text: 'Components',
      exampleType: 'component',
      hasSubNav: true,
    }, {
      path: '/tests',
      text: 'Tests',
      exampleType: 'test',
      hasSubNav: true,
    }],
  },
};

module.exports = navConfig;
