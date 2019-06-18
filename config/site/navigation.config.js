const navConfig = {
  navigation: {
    /* The first page to route to for the site. */
    index: '/home',
    /** List of top level nav items.
     *   Link config options:
     *      path: Path to the link.
     *      text: The text to display on the navigation link.
     *      pageTypes: The page extension(s) that should be displayed under this link.
     *      capabilities: an object describing the capabilities of all pages listed under the specified path.
     *          devToolbar: display a development toolbar that allows switching between locales and themes.
     */
    links: [{
      path: '/home',
      text: 'Home',
      pageTypes: ['home'],
    }, {
      path: '/components',
      text: 'Components',
      pageTypes: ['doc'],
      capabilities: {
        devToolbar: true,
      },
    }, {
      path: '/tests',
      text: 'Tests',
      pageTypes: ['test'],
      capabilities: {
        devToolbar: true,
      },
    }],
  },
};

module.exports = navConfig;
