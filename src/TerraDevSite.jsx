import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import ApplicationBase from 'terra-application';
import ApplicationNavigation from 'terra-application/lib/application-navigation';

// This line will be resolved by webpack
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/siteConfig';

import Site from './site/_Site';

// eslint-disable-next-line import/no-unresolved, import/extensions
const fetchSearchItems = () => import(/* webpackPrefetch: true, webpackChunkName: "build/searchItems" */ 'build/searchItems').then(({ default: items }) => items);

const TerraDevSite = () => (
  <Site
    applicationBase={({ locale, themeName, child }) => (
      <ApplicationBase
        locale={locale}
        themeName={themeName}
        themeIsGlobal
      >
        <BrowserRouter basename={siteConfig.basename}>
          {child}
        </BrowserRouter>
      </ApplicationBase>
    )}
    applicationNavigation={({
      titleConfig,
      navigationItems,
      extensionItems,
      onSelectExtensionItem,
      activeNavigationItemKey,
      onSelectNavigationItem,
      onSelectSettings,
      utilityItems,
      onSelectUtilityItem,
      child,
    }) => (
      <ApplicationNavigation
        titleConfig={titleConfig}
        navigationItems={navigationItems}
        extensionItems={extensionItems}
        onSelectExtensionItem={onSelectExtensionItem}
        activeNavigationItemKey={activeNavigationItemKey}
        onSelectNavigationItem={onSelectNavigationItem}
        onSelectSettings={onSelectSettings}
        utilityItems={utilityItems}
        onSelectUtilityItem={onSelectUtilityItem}
      >
        {child}
      </ApplicationNavigation>
    )}
    fetchSearchItems={fetchSearchItems}
    siteConfig={siteConfig}
  />
);

ReactDOM.render(<TerraDevSite />, document.getElementById('root'));
