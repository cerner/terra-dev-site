import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'xfc';
// import Image from 'terra-image';
// This line will be resolved by webpack
// eslint-disable-next-line import/no-unresolved
// import customSiteConfig from 'site.config';

import App from './app/App';
// import defaultSiteConfig from './config/site.config';
// import routeConfiguration from './app/configureApp';
// import ConfigureUtilities from './app/ConfigureUtilities';
// import Extensions from './app/components/Extensions';
// import GitHubLinkExtension from './app/components/GitHubLinkExtension';
import siteConfig from '../dev-site-config/build/app.config';

Provider.init({
  acls: ['*'],
  secret: () => (Promise.resolve('Success')),
});

const Site = () => {
  // This should be pre-generated
  // const siteConfig = Object.assign({}, defaultSiteConfig, customSiteConfig);
  // siteConfig.appConfig = Object.assign({}, defaultSiteConfig.appConfig, siteConfig.appConfig);
  // const { appConfig, componentConfig } = siteConfig;

  // const { routeConfig, navigation } = routeConfiguration(siteConfig, componentConfig);

  // const routes = Object.freeze(routeConfig);

  // let appLogo;
  // if (appConfig.logoSrc) {
  //   appLogo = (<Image variant="rounded" src={appConfig.logoSrc} height="26px" width="26px" isFluid />);
  // }

  // const nameConfig = {
  //   // accessory: appLogo,
  //   title: appConfig.title,
  // };

  // let extensions = navigation.extensions;

  // if (!extensions && appConfig.extensions) {
  //   const gitHubUrl = appConfig.extensions.gitHubUrl;

  //   if (gitHubUrl) {
  //     extensions = (
  //       <Extensions>
  //         <GitHubLinkExtension href={gitHubUrl} />
  //       </Extensions>
  //     );
  //   }
  // }
  // end what should be pre-generated

  return (
    <Router>
      <App
        nameConfig={siteConfig.nameConfig}
        utilityConfig={siteConfig.utilityConfig}
        routingConfig={siteConfig.routingConfig}
        navigationItems={siteConfig.navigationItems}
        // extensions={extensions}
        indexPath={siteConfig.indexPath}
        defaultLocale={siteConfig.defaultLocale}
        defaultDir={siteConfig.defaultDir}
        defaultTheme={siteConfig.defaultTheme}
        themes={siteConfig.themes}
      />
    </Router>
  );
};

ReactDOM.render(React.createElement(Site, null), document.getElementById('root'));
