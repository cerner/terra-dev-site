import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'xfc';
import Image from 'terra-image';

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
    const { appConfig, componentConfig } = siteConfig;

    const { routeConfig, navigation } = routeConfiguration(siteConfig, componentConfig);

    const routes = Object.freeze(routeConfig);

    let appLogo;
    if (appConfig.logoSrc) {
      appLogo = (<Image variant="rounded" src={appConfig.logoSrc} height="26px" width="26px" isFluid />);
    }

    const nameConfig = {
      accessory: appLogo,
      title: appConfig.title,
    };

    return (
      <Router>
        <App
          nameConfig={nameConfig}
          utilityConfig={ConfigureUtilities.generateInitialUtiltiesConfig(appConfig)}
          routingConfig={routes}
          navigationItems={navigation.links}
          extensions={navigation.extensions ? <navigation.extensions /> : undefined}
          indexPath={navigation.index}
          defaultLocale={appConfig.defaultLocale}
          defaultDir={appConfig.defaultDirection}
          defaultTheme={appConfig.defaultTheme}
        />
      </Router>
    );
  }
}

ReactDOM.render(React.createElement(Site, null), document.getElementById('root'));
