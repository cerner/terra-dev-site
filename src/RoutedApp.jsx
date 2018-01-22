import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'xfc';

import App from './app/App';
import routeConfiguration from './app/configureApp';
import navigationConfig from './config/navigation.config';
// import genearteComponentConfig from './generatedComponentConfig';
import get_configuration from '../scripts/root-directory/index';

// app-root-path
// import siteConfig from '.terra.site.config'

Provider.init({
  acls: ['*'],
  secret: () => (Promise.resolve('Success')),
});

const Site = () => {
  console.log('HERE I AM', process.cwd());
  console.log(get_configuration());

  // const siteConfig
  // const { appConfig } = siteConfig;

  // Use the default navigation config if one is not provided
  // let navConfig = siteConfig.navConfig;
  // if (!navConfig) {
    // navConfig = navigationConfig;
  // }

  // Generate the component config if one is not provided
  // let componentConfig = siteConfig.componentConfig;
  // if (!componentConfig) {
    // const customSearchPaths = siteConfig.examplePaths;
    // const createPages = !siteConfig.disablePages;
    // const createTests = !siteConfig.disableTests;
    // componentConfig = null;
    // componentConfig = generatedComponentConfig(customSearchPaths, createTests, createPages);
  // }

  const { routeConfig, navigation } = routeConfiguration(navigationConfig, {});
  // const { routeConfig, navigation } = routeConfiguration(navConfig, componentConfig);
  const routes = Object.freeze(routeConfig);

  // rootPath={navConfig.rootPath}
  // themes={appConfig.themes}
  // defaultTheme={appConfig.defaultTheme}
  // locales={appConfig.locales}
  // appTitle={appConfig.title}
  // hideBidiUtility={!appConfig.bidirectional}
  // defaultDir={appConfig.defaultDirection}
  // appSubtitle={appConfig.subtitle}
  // appLogoSrc={appConfig.logoSrc}

  return (
    <Router>
      <App
        routeConfig={routes}
        navigation={navigation}
        rootPath="/site"
      />
    </Router>
  );
};

ReactDOM.render(<Site />, document.getElementById('root'));
