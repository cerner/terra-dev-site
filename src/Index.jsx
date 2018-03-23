import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'xfc';

import App from './app/App';
import defaultSiteConfig from './config/site.config';
import routeConfiguration from './app/configureApp';
import ConfigureUtilities from './app/ConfigureUtilities';

Provider.init({
  acls: ['*'],
  secret: () => (Promise.resolve('Success')),
});

class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = { siteConfig: defaultSiteConfig };
  }

  componentDidMount() {
    // SITE_CONFIG_PATH is a global variable defined at runtime by the DefinePlugin within the scripts/start-terra-dev-site/site.webpack.config.
    // eslint-disable-next-line no-undef
    if (SITE_CONFIG_PATH !== undefined) {
      // eslint-disable-next-line no-undef
      import(SITE_CONFIG_PATH)
        .then(module => this.setState({ siteConfig: module.default }));
    }
  }

  render() {
    const siteConfig = Object.assign({}, defaultSiteConfig, this.state.siteConfig);
    siteConfig.appConfig = Object.assign({}, defaultSiteConfig.appConfig, siteConfig.appConfig);
    const { appConfig, navConfig, componentConfig } = siteConfig;

    const { routeConfig, navigation } = routeConfiguration(siteConfig, componentConfig);

    const routes = Object.freeze(routeConfig);

    return (
      <Router>
        <App
          routeConfig={routes}
          navigation={navigation}
          rootPath={navConfig.rootPath}
          utilConfig={ConfigureUtilities.generateInitialUtiltiesConfig(appConfig)}
          // themes={appConfig.themes}
          // defaultTheme={appConfig.defaultTheme}
          // locales={appConfig.locales}
          appTitle={appConfig.title}
          // hideBidiUtility={!appConfig.bidirectional}
          // defaultLocale={appConfig.defaultLocale}
          // defaultDir={appConfig.defaultDirection}
          appLogoSrc={appConfig.logoSrc}
        />
      </Router>
    );
  }
}

ReactDOM.render(React.createElement(Site, null), document.getElementById('root'));
