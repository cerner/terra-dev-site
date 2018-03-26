// import your template documentation and/or examples here

// import GithubRouter from './src/GitHubRouter';

const navConfig = {
  'terra-aggregator': {
    name: 'Aggregator',
    path: '/aggregator',
    pages: [
      {
        name: 'Index',
        path: '/index',
        // component: GithubRouter,
      },
    ],
  },
  'getting-started': {
    name: 'Building A Site',
    path: '/building-a-site',
  },
  config: {
    name: 'Configuration',
    path: '/config',
    // docs: [
    //   {
    //     name: 'Application Configuration',
    //     path: '/app-config',
    //   },
    //   {
    //     name: 'Component Configuration',
    //     path: '/component-config',
    //   },
    //   {
    //     name: 'Navigation Configuration',
    //     path: '/navigation-config',
    //   },
    // ],
    // pages: [
    //   {
    //     name: 'Index',
    //     path: '/index',
    //     component: GithubRouter,
    //   },
    // ],
  },
  webpack: {
    name: 'Webpack',
    path: '/webpack',
    docs: [
      {
        name: 'Configuration',
        path: '/webpack-configs',
      },
      {
        name: 'I18n Plugin',
        path: '/i18n-plugin',
      },
      {
        name: 'Theming Plugin',
        path: '/theming-plugin',
      },
    ],
    tests: [
      {
        name: 'derp test',
        path: '/derp-test',
        // component: GithubRouter,
      },
      {
        name: 'derp test2',
        path: '/derp-test2',
        // component: GithubRouter,
      },
    ],
  },
  templates: {
    name: 'Templates',
    path: '/templates',
    docs: [{
      name: 'Index Page Template',
      path: '/index-page-template',
      // If you have one exmample, use the component key, if more then one example, add to the docs array and remove the component key.
      // component: add your example here
      // docs: [
      //   {
      //     name: // Menu Link Name
      //     path: // The path for the 1st example
      //   },
      //   {
      //     name: // Menu Link Name
      //     path: // The path for the 2nd example
      //   },
      // ],
    }],
  },
};

export default navConfig;
