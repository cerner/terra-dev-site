import React from 'react';
import ReactDOM from 'react-dom';
import RoutedApp from './RoutedApp';
import siteConfig from './config/site.config';

// eslint-disable-next-line no-undef
ReactDOM.render(React.createElement(RoutedApp, { siteConfig: Object.assign(siteConfig, SITE_CONFIG) }), document.getElementById('root'));
