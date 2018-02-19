# Building a Site Using Terra-site
Terra-site dynamically builds a react-hash-routed site based on site configuration, navigation configuration and component configuration.

## Getting Started
- Install with [npmjs](https://www.npmjs.com/):
    - `npm install terra-site`

## How It Works
The site configuration file is the file loaded by the entry point during the webpack build. The site confgiuration provides the necessary navigation, component and application configuration to the site app such that the application can enable the application utilities and recursively build the menu navigation and content routes. The component configuration is truly the only configuration that must be provided, otherwise, Terra-site provided the following default configurations:
- `site.config.js`
- `navigation.config.js`
- `webpack.config.js`
- `webpack.prod.config.js`

## A Minamalist Approach
To build a basic site that uses the default configuration, you must:

1. Generate the component configuration. The easiest approach would be to add the `generate-config` script to the `package.json`:
```
"generate-config": "node node_modules/terra-site/scripts/generate-component-config/generate-component-config.js",
```
This will save your configuration as `./generatedComponentConfig.js`.  **Note:** This script uses default search patterns which assumes a [specific file structure](https://github.com/cerner/terra-site/blob/master/docs/ComponentConfig.md#generating-component-config).
2. Create the site configuration file as `./site.config.js`.
    - Add the component configuration to the `component-config` key.
    - Also, you will likely want to provide to give the site a name, add home page content and provide a page placeholder.

```js
import homeReadMe from './README.md';
import componentConfiguration from './generatedComponentConfig';

const siteConfig = {
  /* The component configuration. */
  componentConfig: componentConfiguration,

  /* The logo to display as the page placeholder. */
  placeholderSrc: 'https://github.com/cerner/terra-core/raw/master/terra.png',

  /* The markdown content to display on the home page. */
  readMeContent: homeReadMe,

  appConfig: {
    /* The logo for the site header. */
    logoSrc: 'https://github.com/cerner/terra-core/raw/master/terra.png',

    /* The title for the site header. */
    title: 'My Site',
  },
};

export default siteConfig;
```
3. Add the `start` script to the `package.json`
```
"start": "webpack-dev-server --config node_modules/terra-site/src/config/webpack.config --progress",
```
4. Now, start the site!
    - `npm run start`

## A More Customized Site

Although Terra-site provide default configuration that will likey suffice for the large majority of all use-cases, Terra-site does allow for full customization. Below is a list of topics which provide more information to get you started creating a customized Terra-site.
- [Site Configuration](https://github.com/cerner/terra-site/blob/master/docs/SiteConfig.md)
- [Navigation Configuration](https://github.com/cerner/terra-site/blob/master/docs/NavigationConfig.md)
- [Component Configuration](https://github.com/cerner/terra-site/blob/master/docs/ComponentConfig.md)
- [Webpack Configuration](https://github.com/cerner/terra-site/blob/master/docs/WebpackConfig.md)
