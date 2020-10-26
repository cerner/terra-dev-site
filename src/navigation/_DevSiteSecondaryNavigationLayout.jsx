import React from 'react';

import { SecondaryNavigationLayout, SecondaryNavigationGroup, NavigationItem } from '@cerner/terra-application/lib/layouts';
import { useLocation, useHistory } from 'react-router-dom';

import DevSitePage from '../pages/_DevSitePage';

const DevSiteSecondaryNavigationLayout = ({config, imports}) => {
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
            <DevSitePage pageContentConfig={navItem} contentComponent={imports[navItem.path]} />
          )}
        />
      );
    })
  );

  return (
    <SecondaryNavigationLayout
      activeNavigationKey={location.pathname}
      onSelectNavigationItem={(key) => history.push(key)}
    >
      {retrieveNavItems(config)}
    </SecondaryNavigationLayout>
  );
};

export default DevSiteSecondaryNavigationLayout;
