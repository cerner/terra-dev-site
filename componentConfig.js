// import your template documentation and/or examples here
import generatedComponentConfig from './generatedComponentConfig';

const componentConfig = {
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
};

const config = Object.assign({}, generatedComponentConfig, componentConfig);

export default config;
