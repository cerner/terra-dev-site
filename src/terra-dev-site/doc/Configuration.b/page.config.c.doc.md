# Page Config

Page config is generally generated for you using the generatePages config ins the site.config, but if you need or want custom page config you can provide your own. Below is an example page config. The config is sorted by Pagetype with ordered arrays of child pages.

```javascript
const config = {
  // doc and test map to page types specified in the navigation config.
  doc: [
    {
      name: 'Getting Started',
      path: '/getting-started',
      // anything other than a js or jsx file need a file extension. js and jsx files should
      // not have a file extension because they may be transpliled.
      content: '../src/terra-dev-site/doc/gettingStarted.md',
      // Type is required. Markdown documents are wrapped differently than js or jsx files.
      type: 'md'
    },
    {
      name: 'Configuration',
      path: '/configuration',
      // Pages have the same schema as described above, can recurse infintely.
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
          name: 'wdio.conf',
          path: '/wdio-conf',
          content: '../src/terra-dev-site/doc/Configuration/wdio.conf.md',
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
