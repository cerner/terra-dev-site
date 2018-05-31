const navConfig = {
  'getting-started': {
    name: 'Building A Site',
    path: '/building-a-site',
  },
  config: {
    name: 'Configuration',
    path: '/config',
    docs: [
      {
        name: 'Application Configuration',
        path: '/app-config',
      },
      {
        name: 'Component Configuration',
        path: '/component-config',
      },
      {
        name: 'Navigation Configuration',
        path: '/navigation-config',
      },
    ],
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
  },
  templates: {
    name: 'Templates',
    path: '/templates',
    docs: [{
      name: 'Index Page Template',
      path: '/index-page-template',
    }],
  },
};

module.exports = navConfig;
