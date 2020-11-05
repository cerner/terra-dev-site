import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import IconSearch from 'terra-icon/lib/icon/IconSearch';
import IconTile from 'terra-icon/lib/icon/IconTile';
import { PrimaryNavigationLayout, NavigationItem } from '@cerner/terra-application/lib/layouts';
import { PageContainer } from '@cerner/terra-application/lib/page';

import DevSitePage from '../pages/_DevSitePage';
import NotFoundPage from '../pages/_NotFoundPage';
import SettingsModal from '../modals/_SettingsModal';
import SearchModal from '../modals/_SearchModal';
import ApplicationSwitcherModal from '../modals/_ApplicataionSwitcherModal';

import siteConfigPropType from '../site/siteConfigPropTypes';
import DevSiteSecondaryNavigation from './_DevSiteSecondaryNavigationLayout';

const propTypes = {
  /**
   * The site config for the application.
   */
  siteConfig: siteConfigPropType.isRequired,
};

const DevSiteNavigationLayout = ({ siteConfig }) => {
  const location = useLocation();
  const history = useHistory();
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showExtensionModal, setShowExtensionModal] = React.useState();
  const [showUtilityModal, setShowUtilityModal] = React.useState();

  const setNavigationState = (key) => {
    history.push(siteConfig.routesMap[key]);
  };

  const handleSettingsSelection = () => {
    setShowSettingsModal(true);
  };

  const handleExtensionSelection = (key, metaData) => {
    setShowExtensionModal(metaData);
  };

  const handleUtilitySelection = (key, metaData) => {
    setShowUtilityModal(metaData);
  };

  const getExtensionItems = () => {
    const extensionArray = (siteConfig.extensionItems || []).map((ext) => ({
      icon: <ext.icon />,
      key: ext.key,
      text: ext.text,
      metaData: { render: () => (<ext.modal onRequestClose={() => { setShowExtensionModal(); }} />) },
    }));

    extensionArray.unshift({
      icon: <IconSearch />,
      key: 'terra-dev-site.search',
      text: 'Search',
      metaData: { render: () => (<SearchModal pageConfig={siteConfig.pageConfig} onRequestClose={() => { setShowExtensionModal(); }} />) },
    });
    return extensionArray;
  };

  const getUtilityItems = (sites) => {
    const utilityItems = [];
    if (sites.length > 0) {
      utilityItems.push({
        icon: <IconTile />,
        key: 'terra-dev-site.application-switcher',
        text: 'Application Switcher',
        metaData: { render: () => (<ApplicationSwitcherModal sites={sites} onRequestClose={() => { setShowUtilityModal(); }} />) },
      });
    }
    return utilityItems;
  };

  const firstDir = () => `/${location.pathname.split('/')[1]}`;

  return (
    <>
      <PrimaryNavigationLayout
        titleConfig={siteConfig.titleConfig}
        activeNavigationKey={firstDir()}
        onSelectNavigationItem={(key) => { setNavigationState(key); }}
        onSelectSettings={handleSettingsSelection}
        onSelectExtensionItem={handleExtensionSelection}
        extensionItems={getExtensionItems()}
        utilityItems={getUtilityItems(siteConfig.sites)}
        onSelectUtilityItem={handleUtilitySelection}
        renderNavigationFallback={() => (
          <PageContainer isMain>
            <NotFoundPage />
          </PageContainer>
        )}
      >
        {siteConfig.navigationConfig.map((navItem) => {
          const renderProps = {};
          if (navItem.pageConfig) {
            renderProps.renderPage = () => (
              <DevSitePage pageContentConfig={navItem.pageConfig} contentImports={siteConfig.contentImports} />
            );
          } else {
            renderProps.renderLayout = () => (
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
      {showSettingsModal && <SettingsModal onRequestClose={() => { setShowSettingsModal(false); }} />}
      {showExtensionModal && showExtensionModal.render()}
      {showUtilityModal && showUtilityModal.render()}
    </>
  );
};

DevSiteNavigationLayout.propTypes = propTypes;

export default DevSiteNavigationLayout;
