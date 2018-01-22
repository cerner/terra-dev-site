
const config = {
  rootPath: '/site',
  appLogoSrc: undefined, // change this to
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
    }, {
      path: '/tests',
      text: 'Tests',
      exampleType: 'tests',
    }],
  },
};

export default config;
