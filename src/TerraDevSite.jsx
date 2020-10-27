import React from 'react';
import ReactDOM from 'react-dom';

import Site from './site/_Site';

import devSiteConfig from './templates/devSiteConfig.template';

import './site/site.module.scss';
// import siteConfig from '../config/site/site.config';

// console.log('Placeholder', placeholder);
console.log('devSiteConfig', devSiteConfig);

// eslint-disable-next-line import/no-unresolved, import/extensions
const fetchSearchItems = () => import(/* webpackPrefetch: true, webpackChunkName: "build/searchItems" */ 'build/searchItems').then(({ default: items }) => items);

// const TerraDevSite = () => (
//   <Site
//     applicationBase={({ locale, themeName, child }) => (
//       <ApplicationBase
//         locale={locale}
//         themeName={themeName}
//         themeIsGlobal
//       >
//         <BrowserRouter basename={devSiteConig.basename}>
//           {child}
//         </BrowserRouter>
//       </ApplicationBase>
//     )}
//     applicationNavigation={({
//       titleConfig,
//       navigationItems,
//       extensionItems,
//       onSelectExtensionItem,
//       activeNavigationItemKey,
//       onSelectNavigationItem,
//       onSelectSettings,
//       utilityItems,
//       onSelectUtilityItem,
//       child,
//     }) => (
//       <ApplicationNavigation
//         titleConfig={titleConfig}
//         navigationItems={navigationItems}
//         extensionItems={extensionItems}
//         onSelectExtensionItem={onSelectExtensionItem}
//         activeNavigationItemKey={activeNavigationItemKey}
//         onSelectNavigationItem={onSelectNavigationItem}
//         onSelectSettings={onSelectSettings}
//         utilityItems={utilityItems}
//         onSelectUtilityItem={onSelectUtilityItem}
//       >
//         {child}
//       </ApplicationNavigation>
//     )}
//     fetchSearchItems={fetchSearchItems}
//     siteConfig={siteConfig}
//   />
// );

const TerraDevSite = () => (
  <Site
    siteConfig={devSiteConfig}
  />
);

ReactDOM.render(<TerraDevSite />, document.getElementById('root'));
