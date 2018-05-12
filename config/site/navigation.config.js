const navConfig = {
  navigation: {
    index: '/home',
    links: [{
      path: '/home',
      text: 'Home',
      pageTypes: ['home'],
    }, {
      path: '/components',
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
