import React from 'react';
import ReactDOM from 'react-dom';

import Site from './site/_Site';

import devSiteConfig from './templates/terra.dev-site-config-template?extend-dev-site.config.js';

import './site/site.module.scss';

console.log('devSiteConfig', devSiteConfig);

console.log('EXTEND');

const ExtendDevSite = () => (
  <Site
    siteConfig={devSiteConfig}
  />
);

ReactDOM.render(<ExtendDevSite />, document.getElementById('root'));
