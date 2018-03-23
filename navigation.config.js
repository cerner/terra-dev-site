import GithubRouter from './src/GitHubRouter';

const navConfig = {
  rootPath: '/dev-site',
  navigation: {
    index: '/dev-site/home',
    links: [{
      path: '/dev-site/home',
      text: 'Home',
      exampleType: 'home',
    }, {
      path: '/dev-site/getting-started',
      text: 'Getting Started',
      exampleType: 'docs',
      hasSubNav: true,
      menuProps: {
        menuText: 'Getting Started',
        subMenuText: 'Info',
      },
    }, {
      path: '/tests',
      text: 'Tests',
      exampleType: 'tests',
      hasSubNav: true,
    }, {
      path: '/components',
      text: 'Components',
      exampleType: 'pages',
      hasSubNav: true,
    }],
    // extensions: GithubRouter,
  },
};

export default navConfig;
