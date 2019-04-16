const navConfig = {
  navigation: {
    /* The first page to route to for the site. */
    index: '/home',
    /** List of top level nav items.
     *   Link config options:
     *      path: Path to the link.
     *      text: The text to display on the navigation link.
     *      pageTypes: The page extension(s) that should be displayed under this link.
     */
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
    }],
  },
};

module.exports = navConfig;
