# Navigation Configuration
Terra site requires a navigation configuration to build the main menu navigation, the site pages and each page's sub-navigation. Terra Site package provides a [default navigation config] that is easily customizable. This configuration provides:
- `rootPath` [string] the url path prepended to the urls of the front-facing (non-test) site pages
- `navigation` [object] the nav configuration which provides the `index` and `links`
    - `index` [string] the default site route
    - `links` [array] the list of link configuration objects to build by the navigation

#### Link Options

Name | Type | Description
--- | ---  | ---
path | string | **Required**: Route of the link.
text | string | **Required**: Text to display as the link name.
exampleType | string | Terra-site options are 'home', 'pages' and 'tests', which the [routeConfiguration] builder uses to determine which kind of page should be built. A custom key can be provided to filter the menu and content created by the route builder for any links using non-site component pages.
hasSubNav | boolean | Indicates to the builder the page has sub-navigation.
component | ReactComponent | The component to render with the link. It must accept these props: `config`, `pathRoot`, `exampleType`, and `placeholderSrc`. The [routeConfiguration] builder will alway provide these props. By default, Terra Site will use the Home and Components components.
menuComponent | ReactComponent | The menu component to render with the link. It must accept these props: `config`, `pathRoot`, `exampleType`, `isSubMenu`. The [routeConfiguration] builder will alway provide these props. By default, Terra Site will use the ComponentsMenu.

#### Custom Navigation Example
```jsx
import GettingStartedComponent from './GettingStarted/GettingStartedComponent';
import DocumentsComponent from './Documentation/DocumentsComponent';

const navigationConfig = {
  rootPath: '/custom-site',
  navigation: {
    index: '/custom-site/home',
    links: [{
      path: '/custom-site/home',
      text: 'The Home Page',
      exampleType: 'home',
    }, {
      path: '/custom-site/getting-started',
      text: 'Lets Get Started'
      exampleType: 'pages',
      component: GettingStartedComponent,
    },
    {
      path: '/custom-site/documents',
      text: 'More Documentation',
      exampleType: 'docs',
      hasSubNavigation: true,
      menuComponent: DocumentsComponent,
    }],
  },
};
```
[default navigation config]: https://github.com/cerner/terra-site/blob/master/src/config/navigation.config.js
[routeConfiguration]: https://github.com/cerner/terra-site/blob/master/src/app/configureApp.jsx#L72
