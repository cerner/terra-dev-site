import React from 'react';

import { SecondaryNavigationLayout, SecondaryNavigationGroup, NavigationItem } from '@cerner/terra-application/lib/layouts';
import { useLocation, useHistory } from 'react-router-dom';

import DevSitePage from '../pages/_DevSitePage';

const DevSiteSecondaryNavigationLayout = ({config, contentImports}) => {
  const location = useLocation();
  const history = useHistory();

  const retrieveNavItems = (navItems) => (
    navItems.map((navItem) => {
      if (navItem.children) {
        return (
          <SecondaryNavigationGroup
            key={navItem.text}
            text={navItem.text}
          >
            {retrieveNavItems(navItem.children)}
          </SecondaryNavigationGroup>
        );
      }
      return (
        <NavigationItem
          key={navItem.path}
          navigationKey={navItem.path}
          text={navItem.text}
          renderPage={() => (
            <DevSitePage pageContentConfig={navItem} contentImports={contentImports} />
          )}
        />
      );
    })
  );

  return (
    <SecondaryNavigationLayout
      activeNavigationKey={location.pathname}
      onSelectNavigationItem={(key) => history.push(key)}
      renderNavigationFallback={() => <p>Nope</p>}
    >
      {retrieveNavItems(config)}
    </SecondaryNavigationLayout>
  );
};

export default DevSiteSecondaryNavigationLayout;
