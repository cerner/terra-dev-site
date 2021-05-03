import React from 'react';
import PropTypes from 'prop-types';
import { PageContainer } from '@cerner/terra-application/lib/page';
import { useLocation, useHistory } from 'react-router-dom';
import NavigationItem from '@cerner/terra-application/lib/layouts/shared/NavigationItem';
import NavigationItemContext from '@cerner/terra-application/lib/layouts/shared/NavigationItemContext';

import SecondaryNavigationLayout from './secondary-navigation-layout/SecondaryNavigationLayout';
import SecondaryNavigationGroup from './secondary-navigation-layout/SecondaryNavigationGroup';

import DevSitePage from '../pages/_DevSitePage';
import NotFoundPage from '../pages/_NotFoundPage';
import { contentImportsShape, navigationConfigShape } from '../site/siteConfigShapes';

const propTypes = {
  /**
   * The unique id for secondary navigation layout.
   */
  id: PropTypes.string.isRequired,
  /**
   * The map linking the route to the content component to load.
   */
  contentImports: contentImportsShape.isRequired,
  /**
   * The navigation configuration describing the secondary navigation
   */
  config: navigationConfigShape,
  /**
   * The label to apply to secondary navigation.
   */
  label: PropTypes.string.isRequired,
};

const DevSiteSecondaryNavigationLayout = ({
  id, label, config, contentImports,
}) => {
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
      label={label}
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
