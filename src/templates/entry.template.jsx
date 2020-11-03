import React from 'react';
import ReactDOM from 'react-dom';

import Entry from '<%= entryPath %>';

// eslint-disable-next-line import/no-unresolved
import siteConfig from '<%= configTemplatePath %>';

console.log('siteConfig', siteConfig);

ReactDOM.render(<Entry siteConfig={siteConfig} />, document.getElementById('root'));
