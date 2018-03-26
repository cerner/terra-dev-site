import React from 'react';
import { Extensions, GitHubLinkExtension } from './index.js'

const extensions = (
  <Extensions>
    <GitHubLinkExtension href="https://github.com/cerner/terra-dev-site" />
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
    }],
    extensions,
  },
};

export default navConfig;
