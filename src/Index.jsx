/* global TERRA_DEV_SITE_BASENAME */
// TERRA_DEV_SITE_BASENAME is defined by webpack
import React from 'react';
import ReactDOM from 'react-dom';

import ApplicationBase from 'terra-application';
import ApplicationNavigation from 'terra-application-navigation';

// This line will be resolved by webpack
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/appConfig';

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
        {child}
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
    basename={TERRA_DEV_SITE_BASENAME}
    fetchSearchItems={fetchSearchItems}
    siteConfig={siteConfig}
  />
);

ReactDOM.render(<TerraDevSite />, document.getElementById('root'));
