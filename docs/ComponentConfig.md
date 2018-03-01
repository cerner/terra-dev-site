# Component Configuration
Terra-dev-site requires component configuration to recursively build the menu navigation and the content routes. The [routeConfiguration] builder expects this configuration to be an object containing component config objects.

#### Component Config API
This configuration must provide the `name` and `path` keys. These keys are needed to successfully create the navigation and routes. Then use the following keys to add meaningful content:
- `component` - a react component to render at this route
- `pages` - an array of of site page configuration objects.
- `tests` - an array of test page configuration objects.

Terra-dev-site will create sub-navigation for any component configuration using the `pages` or `tests` keys and will add a default Placeholder to render at that route. To replace the defaulted terra-dev-site Placeholder, supplying a `component` key in conjunction with `pages` and/or `tests`.

#### Component API Example
```
  'get-started': {
    name: 'Get Started',
    path: '/get-started'
    component: GetStarted,
  },
```

#### Full Component Configuration Example
As mentioned, the full configuration is an object composed of component configurations.
```jsx
// Component Examples
import GetStarted from './GettingStarted/GetStarted';
import FirstExample from './Documentation/FirstExample';
import SecondExample from './Documentation/SecondExample';

// Test Examples
import DefaultExample from './Documentation/DefaultExample';

const componentConfig = {
  'get-started': {
    name: 'Get Started',
    path: '/get-started'
    component: GetStarted,
  },
  'get-started-examples': {
    name: 'Examples',
    path: '/examples',
    pages: [
      {
        name: 'First Example 1',
        path: '/first-example',
        component: FirstExample,
      }, {
        name: 'Example 2',
        path: '/second-example',
        component: SecondExample,
      },
    ],
    tests: [
      {
        name: 'Default Example',
        path: '/default-example',
        component: DefaultExample,
      },
    ],
  },
};
```
### Generating Component Config
Terra-dev-site provides a component generation script, called `generate-component-config` which will search for page and test example components and then provide the respective configuration needed to render the navigation and content when using the site's default Components and MenuComponents.

#### generate-component-config Usage
In the `package.json`, add the script
```node
"generate-config": "node node_modules/terra-dev-site/scripts/generate-component-config/generate-component-config.js",
```

#### generate-component-config Options

Flag | Type | Description
--- | ---  | ---
-s, --search | string | Regex pattern to search for site and tests examples. Note multiple search flags can be passed. These are the [default search patterns].
-o, --output | string | The output location of the generated configuration file. By default, this is the same directory as the process call.
--no-pages | string | Disable the generation of page example configuration. By default, this is false.
--no-tests | boolean | Disables the generation of test example configuration. By default, this is false.

**Note:** The [default search patterns] assume a specific file structure. To use this generation script out-of-the-box, use the following structure:
```
component
    /docs
    /examples # Searches for page examples here
        /test-examples  # Searches for test examples here
        Index.site-page.jsx
    /src
    /tests
```
For a mono-repo structure, it assumes all packages are will be located in the `packages` directory.

[default search patterns]: https://github.com/cerner/terra-dev-site/blob/master/scripts/generate-component-config/generate-component-config.js#L25
[routeConfiguration]: https://github.com/cerner/terra-dev-site/blob/master/src/app/configureApp.jsx#L72
