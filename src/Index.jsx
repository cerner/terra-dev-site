import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
// This line will be resolved by webpack
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/appConfig';

import App from './app/App';

const Site = () => (
  <Router>
    <App
      nameConfig={siteConfig.nameConfig}
      utilityConfig={siteConfig.utilityConfig}
      routingConfig={siteConfig.routingConfig}
      navigationItems={siteConfig.navigationItems}
      extensions={siteConfig.extensions}
      indexPath={siteConfig.indexPath}
      defaultTheme={siteConfig.defaultTheme}
      themes={siteConfig.themes}
    />
  </Router>
);

ReactDOM.render(React.createElement(Site, null), document.getElementById('root'));
