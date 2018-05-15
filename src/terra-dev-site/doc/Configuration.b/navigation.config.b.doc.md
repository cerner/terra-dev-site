# Navigation Config

Navigation config specifies the items that display at the top of the page as well as the page types that are assoicated to those items.

By default home, components, and tests are specifed with the home, doc and test page types respectively.

Links may be set to hidden if it is not desired to show the link at the top of the page, as we have done with the test link by default.

[Default navigation config](https://github.com/cerner/terra-dev-site/blob/master/config/site/navigation.config.js)

```javascript
const navConfig = {
   navigation: {
    // The first page to route to for the site.
    index: '/home',
    // List of Top level nav items.
    links: [{
      // Path to the link.
      path: '/tests',
      // Link Text
      text: 'Tests',
      // Pages included in the link
      pageTypes: ['test'],
      // Is link not included in top menu.
      isHidden: true,
    }],
  },
}:

module.exports = navConfig;
```
