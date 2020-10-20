import React from 'react';
import ReactDOM from 'react-dom';

import ApplicationBase from '@cerner/terra-application';
import ApplicationContainer from '@cerner/terra-application/lib/application-container/ApplicationContainer';
import PrimaryNavigationLayout, { NavigationItem } from '@cerner/terra-application/lib/application-layouts/PrimaryNavigationLayout';

import AppSettingsContext from './navigation/_AppSettingsContext';
import AppSettingsProvider from './navigation/_AppSettingsProvider';
import TerraMdxProvider from './mdx/_TerraMdxProvider';

import devSiteConfig from './templates/devSiteConfig.template';

import './site/site.module.scss';

// console.log('Placeholder', placeholder);
console.log('devSiteConig', devSiteConfig);

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

const TerraDevSite2 = () => (
  <AppSettingsProvider settingsConfig={devSiteConfig.settingsConfig}>
    <AppSettingsContext.Consumer>
      {({ currentLocale, currentThemeClassName }) => (
        <ApplicationBase
          locale={currentLocale}
          themeName={currentThemeClassName}
        >
          <TerraMdxProvider>
            <ApplicationContainer>
              <PrimaryNavigationLayout
                titleConfig={devSiteConfig.nameConfig}
              >
                <p>
                  Derp
                </p>
              </PrimaryNavigationLayout>
            </ApplicationContainer>
          </TerraMdxProvider>
        </ApplicationBase>
      )}
    </AppSettingsContext.Consumer>
  </AppSettingsProvider>
);

ReactDOM.render(<TerraDevSite2 />, document.getElementById('root'));
