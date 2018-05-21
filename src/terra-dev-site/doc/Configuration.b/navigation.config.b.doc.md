# Navigation Config

Terra-dev-site requires a navigation configuration to build the main menu navigation links, as well as the page types associated with those links. Terra-dev-site package provides a [default navigation config](https://github.com/cerner/terra-dev-site/blob/master/config/site/navigation.config.js) that is easily customizable. By default home, components, and tests are specified with the home, doc and test page types respectively. Links may be hidden if it is not desired to show the link at the top of the page; we have done with the test link by default.

```javascript
const navConfig = {
   navigation: {
    // The first page to route to for the site
    index: '/home',
    // List of top level navigation items
    links: [{
      // The path for the link
      path: '/tests',
      // The text to display on the navigation link
      text: 'Tests',
      // The page extension(s) that should be displayed under this link
      pageTypes: ['test'],
      // Whether or not to display the link in the top navigation
      isHidden: true,
    }],
  },
}:

module.exports = navConfig;
```
