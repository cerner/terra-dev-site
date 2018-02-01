import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'xfc';

import App from './app/App';
import defaultSiteConfig from './config/site.config';
import routeConfiguration from './app/configureApp';

Provider.init({
  acls: ['*'],
  secret: () => (Promise.resolve('Success')),
});

class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = { componentConfig: {} };
  }

  componentDidMount() {
    // COMPONENT_CONFIG_PATH is a global variable defined at runtime by the DefinePlugin within the scripts/start-terra-site/site.webpack.config.
    // eslint-disable-next-line no-undef
    if (COMPONENT_CONFIG_PATH !== undefined) {
      // eslint-disable-next-line no-undef
      import(COMPONENT_CONFIG_PATH)
        .then(module => this.setState({ componentConfig: module.default }));
    }
  }

  render() {
    // SITE_CONFIG is a global variable defined at runtime by the DefinePlugin within the scripts/start-terra-site/site.webpack.config.
    // eslint-disable-next-line no-undef
    const siteConfig = Object.assign({}, defaultSiteConfig, SITE_CONFIG);
    // eslint-disable-next-line no-undef
    siteConfig.appConfig = Object.assign({}, defaultSiteConfig.appConfig, SITE_CONFIG.appConfig);

    const { appConfig, navConfig } = siteConfig;
    const componentConfig = this.state.componentConfig;

    const { routeConfig, navigation } = routeConfiguration(siteConfig, componentConfig);

    const routes = Object.freeze(routeConfig);

    return (
      <Router>
        <App
          routeConfig={routes}
          navigation={navigation}
          rootPath={navConfig.rootPath}
          themes={appConfig.themes}
          defaultTheme={appConfig.defaultTheme}
          locales={appConfig.locales}
          appTitle={appConfig.title}
          hideBidiUtility={appConfig.bidirectional && !appConfig.bidirectional}
          defaultDir={appConfig.defaultDirection}
          appSubtitle={appConfig.subtitle}
          appLogoSrc={appConfig.logoSrc}
        />
      </Router>
    );
  }
}

ReactDOM.render(React.createElement(Site, null), document.getElementById('root'));
