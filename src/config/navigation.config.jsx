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
      exampleType: 'pages',
      hasSubNav: true,
    }, {
      path: '/tests',
      text: 'Tests',
      exampleType: 'tests',
      hasSubNav: true,
    }],
  },
};

export default navConfig;
