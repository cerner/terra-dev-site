import homeReadMe from './README.md';
import navConfig from './navigation.config';
import componentConfig from './componentConfig';

const siteConfig = {
  /* The navigation configuration.  */
  navConfig,

  /* The path to the component configuration. */
  componentConfig,

  /* The image to display as page placeholder when a component does not render. */
  placeholderSrc: 'https://github.com/cerner/terra-dev-site/raw/master/terra.png',

  /* The README content to display on the home page. */
  readMeContent: homeReadMe,

  appConfig: {
    /* The loge the site header should display. */
    logoSrc: 'https://github.com/cerner/terra-dev-site/raw/master/terra.png',
    /* The title the site header should display. */
    title: 'Terra Dev Site',
    locales: ['en'],
    bidirectional: false,
  },
};

export default siteConfig;
