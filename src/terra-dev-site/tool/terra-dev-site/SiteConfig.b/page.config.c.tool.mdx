# Page Config

## Auto Generated Page Config

Terra-dev-site uses the pages configuration to recursively build the menu navigation and the content routes. The page config will be generated for you using the the `generatePages` config included in the site config. The following options available to be listed added as objects in `searchPatterns` key in the `generate-config`:
 - root: there search pattern starts.
 - entryPoint: add to the search pattern and is the beginning of the directory structure for menu navigation.
 - dist: (option) directory containing transpiled code to use if hot reloading is enabled and is in prod
 - source: (option) directory containing source code to use if hot reloading is enabled and not in prod mode

When you start the site, the `generateAppConfig` script will use these to build the pages.

## Custom Page Config

If you need or want custom page config, you can provide your own by including the `pagesConfig` key in the site config. Below is an example page config. The config is sorted by `Pagetype` such that each page type key is an ordered arrays of page configurations.

This page configuration must provide the `name`, and `path` keys. These keys are needed to successfully create the navigation and routes. Then use the following keys to add meaningful content:
- `content` - the content to render at this route
- `type` - the file type. Options include but are not limited to `js`, `jsx`, or `md`
- `pages` - an array of pages configuration objects for nested navigation

Terra-dev-site will create sub-navigation for any component configuration using the `pages` key and will add a default Placeholder to render at that route.

#### Component API Example
```
  'get-started': {
    name: 'Get Started',
    path: '/get-started'
    component: GetStarted,
  },
```

#### Full Page Config Example
```javascript
const config = {
  // doc and test map to page types specified in the navigation config.
  doc: [
    {
      name: 'Getting Started',
      path: '/getting-started',
      content: '../src/terra-dev-site/doc/gettingStarted.md',
      type: 'md'
    },
    {
      name: 'Configuration',
      path: '/configuration',
      // Pages have the same schema as described above, can recurse infinitely.
      pages: [
        {
          name: 'site.config',
          path: '/site-config',
          content: '../src/terra-dev-site/doc/Configuration/site.config.md',
          type: 'md'
        },
        {
          name: 'navigation.config',
          path: '/navigation-config',
          content: '../src/terra-dev-site/doc/Configuration/navigation.config.md',
          type: 'md'
        },
        {
          name: 'page.config',
          path: '/page-config',
          content: '../src/terra-dev-site/doc/Configuration/page.config.md',
          type: 'md'
        },
        {
          name: 'webpack.config',
          path: '/webpack-config',
          content: '../src/terra-dev-site/doc/Configuration/webpack.config.md',
          type: 'md'
        }
      ]
    },
    {
      name: 'Upgrade Guides',
      path: '/terra-dev-site/upgrade-guides',
      pages: [
        {
          name: 'v1.0.0',
          path: '/v-1-0-0',
          content: '../src/terra-dev-site/doc/UpgradeGuides/v1.0.0.md',
          type: 'md'
        },
        {
          name: 'v0.5',
          path: '/v-0-5',
          content: '../src/terra-dev-site/doc/UpgradeGuides/v0.5',
          type: 'jsx'
        }
      ]
    }
  ],
  test: [
    {
      name: 'test example',
      path: '/test-example',
      content: '../src/terra-dev-site/doc/testExample',
      type: 'md'
    },
  ],
};

```
