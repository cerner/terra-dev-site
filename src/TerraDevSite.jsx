import React from 'react';
import ReactDOM from 'react-dom';

import Site from './site/_Site';

// eslint-disable-next-line import/no-unresolved
import devSiteConfig from './templates/terra.dev-site-config-template?terra-dev-site-config';

console.log('devSiteConfig', devSiteConfig);

const TerraDevSite = () => (
  <Site
    siteConfig={devSiteConfig}
  />
);

ReactDOM.render(<TerraDevSite />, document.getElementById('root'));
