import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import IconSearch from 'terra-icon/lib/icon/IconSearch';
import IconTile from 'terra-icon/lib/icon/IconTile';
import { PrimaryNavigationLayout, NavigationItem } from '@cerner/terra-application/lib/layouts';

import DevSitePage from '../pages/_DevSitePage';
import NotFoundPage from '../pages/_NotFoundPage';
import SettingsModal from '../modals/_SettingsModal';

import siteConfigPropType from '../site/siteConfigPropTypes';
import DevSiteSecondaryNavigation from './_DevSiteSecondaryNavigationLayout';

const propTypes = {

  /**
   * function to return search items
   */
  fetchSearchItems: PropTypes.func,

  /**
   * The site config for the application.
   */
  siteConfig: siteConfigPropType.isRequired,

  /**
   * Injected by react-router: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),

  /**
   * Injected by react-router: the object representing browser history.
   */
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object,

};

const defaultProps = {
  location: undefined,
  history: undefined,
};

const DevSiteNavigation = ({ siteConfig }) => {
  const location = useLocation();
  const history = useHistory();
  const [showSettingsMenu, setShowSettingsMenu] = React.useState(false);

  const setNavigationState = (key) => {
    history.push(key);
  };
  console.log('location', location);

  const handleSettingsSelection = () => {
    setShowSettingsMenu(true);
  };

  const firstDir = () => `/${location.pathname.split('/')[1]}`;

  return (
    <>
      <PrimaryNavigationLayout
        titleConfig={siteConfig.titleConfig}
        activeNavigationKey={firstDir()}
        onSelectNavigationItem={(key) => { setNavigationState(key); }}
        onSelectSettings={handleSettingsSelection}
        // utilityItems: DevSiteNavigation.getUtilityItems(apps),
        // renderNavigationFallback={() => <NotFoundPage />}
        renderNavigationFallback={() => <p>Nope</p>}
      >
        {siteConfig.navigationConfig.map((navItem) => {
          const renderProps = {};
          if (navItem.pageConfig) {
            renderProps.renderPage = () => (
              <DevSitePage pageContentConfig={navItem.pageConfig} contentImports={siteConfig.contentImports} />
            );
          } else {
            renderProps.render = () => (
              <DevSiteSecondaryNavigation config={navItem.children} contentImports={siteConfig.contentImports} />
            );
          }
          return (
            <NavigationItem
              key={navItem.path}
              navigationKey={navItem.path}
              text={navItem.text}
              {...renderProps}
            />
          );
        })}
      </PrimaryNavigationLayout>
      {showSettingsMenu && <SettingsModal onRequestClose={() => { setShowSettingsMenu(false); }} />}
    </>
  );
};

DevSiteNavigation.propTypes = propTypes;
DevSiteNavigation.defaultProps = defaultProps;

export default DevSiteNavigation;
