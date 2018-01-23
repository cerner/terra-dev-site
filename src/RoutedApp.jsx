import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'xfc';

import App from './app/App';
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
    if(COMPONENT_CONFIG_PATH !== undefined) {
      import(COMPONENT_CONFIG_PATH)
        .then(module => this.setState({ componentConfig: module.default }));
    } else {
      // Need a way to dynamically pull in the siteImports without setting them to state and with the use of promises.
      this.setState({ componentConfig: {} });
    }
  }

  render() {
    const siteConfig = this.props.siteConfig;

    const { appConfig, navConfig: navigationConfig } = siteConfig;
    const componentConfig = this.state.componentConfig;

    const { routeConfig, navigation } = routeConfiguration(navigationConfig, componentConfig, siteConfig.placeholderSrc, siteConfig.readMeContent);

    const routes = Object.freeze(routeConfig);

    return (
      <Router>
        <App
          routeConfig={routes}
          navigation={navigation}
          rootPath={navigationConfig.rootPath}
          themes={appConfig.themes}
          defaultTheme={appConfig.defaultTheme}
          locales={appConfig.locales}
          appTitle={appConfig.title}
          hideBidiUtility={!appConfig.bidirectional}
          defaultDir={appConfig.defaultDirection}
          appSubtitle={appConfig.subtitle}
          appLogoSrc={appConfig.logoSrc}
        />
      </Router>
    );
  }
}

export default Site;
