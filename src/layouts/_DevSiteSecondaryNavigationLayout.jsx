import React from 'react';
import PropTypes from 'prop-types';
import { PageContainer } from '@cerner/terra-application/lib/page';
import {
  SecondaryNavigationLayout,
  SecondaryNavigationGroup,
  NavigationItem,
  NavigationItemContext,
} from '@cerner/terra-application/lib/layouts';
import { useLocation, useHistory } from 'react-router-dom';

import DevSitePage from '../pages/_DevSitePage';
import NotFoundPage from '../pages/_NotFoundPage';
import { contentImportsPropType, navigationConfigPropType } from '../site/siteConfigPropTypes';

const propTypes = {

  /**
   * The unique id for secondary navigation layout.
   */
  id: PropTypes.string.isRequired,
  /**
   * The map linking the route to the content component to load.
   */
  contentImports: contentImportsPropType.isRequired,
  /**
   * The navigation configuration describing the secondary navigation
   */
  config: navigationConfigPropType,
};

const DevSiteSecondaryNavigationLayout = ({ id, config, contentImports }) => {
  const location = useLocation();
  const history = useHistory();
  const { isActive } = React.useContext(NavigationItemContext);

  if (!isActive) {
    return null;
  }

  const retrieveNavItems = (navItems) => (
    navItems.map((navItem) => {
      if (navItem.children) {
        return (
          <SecondaryNavigationGroup
            key={navItem.label}
            label={navItem.label}
          >
            {retrieveNavItems(navItem.children)}
          </SecondaryNavigationGroup>
        );
      }
      return (
        <NavigationItem
          key={navItem.path}
          navigationKey={navItem.path}
          label={navItem.label}
          renderPage={() => (
            <DevSitePage pageContentConfig={navItem} contentImports={contentImports} />
          )}
        />
      );
    })
  );

  return (
    <SecondaryNavigationLayout
      id={id}
      activeNavigationKey={location.pathname}
      onSelectNavigationItem={(key) => history.push(key)}
      renderNavigationFallback={() => (
        <PageContainer isMain>
          <NotFoundPage />
        </PageContainer>
      )}
    >
      {retrieveNavItems(config)}
    </SecondaryNavigationLayout>
  );
};

DevSiteSecondaryNavigationLayout.propTypes = propTypes;

export default DevSiteSecondaryNavigationLayout;
