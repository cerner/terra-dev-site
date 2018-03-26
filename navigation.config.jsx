import React from 'react';
import GithubLinkExtension from './src/components/GitHubLinkExtension';
import Extensions from './src/components/Extensions';

const extensions = (
  <Extensions>
    <GithubLinkExtension href="https://github.com/cerner/terra-dev-site" />
  </Extensions>
);

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
    extensions,
  },
};

export default navConfig;
