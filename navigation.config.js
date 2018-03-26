import React from 'react';
import GithubRouter from './src/GitHubRouter';
import GithubLinkExtension from './src/app/common/GitHubLinkExtension';
import Extensions from './src/app/common/Extensions';

const extensions = (
  <Extensions>
    <GithubLinkExtension href="https://github.com/cerner?utf8=%E2%9C%93&q=terra&type=&language=" />
    <GithubLinkExtension href="https://github.com/cerner?utf8=%E2%9C%93&q=terra&type=&language=" />
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
