const navConfig = {
  //  navigation: {
  //   The first page to route to for the site.
  //   index: '/home',
  //   List of Top level nav items.
  //   links: [{
  //     Path to the link.
  //     path: '/tests',
  //     Link Text
  //     text: 'Tests',
  //     Pages included in the link
  //     pageTypes: ['test'],
  //     Is link not included in top menu.
  //     isHidden: true,
  //   }],
  // },
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
