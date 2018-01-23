module.exports = {
  rootPath: '/site',
  navigation: {
    index: '/site/home',
    links: [{
      path: '/site/home',
      text: 'Home',
      exampleType: 'home',
      isStatic: true,
    }, {
      path: '/site/components',
      text: 'Components',
      exampleType: 'pages',
    }, {
      path: '/tests',
      text: 'Tests',
      exampleType: 'tests',
    }],
  },
};
