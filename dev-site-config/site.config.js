import homeReadMe from '../README.md';
import navConfig from './navigation.config';
import componentConfig from './componentConfig';

const siteConfig = {
  /* The navigation configuration.  */
  navConfig,

  /* The path to the component configuration. */
  componentConfig,

  /* The README content to display on the home page. */
  readMeContent: homeReadMe,

  appConfig: {
    /* The title the site header should display. */
    title: 'Terra Dev Site',
    // locales: ['en'],
    // bidirectional: false,
    extensions: {
      gitHubUrl: 'https://github.com/cerner/terra-dev-site',
    },
  },
};

export default siteConfig;
