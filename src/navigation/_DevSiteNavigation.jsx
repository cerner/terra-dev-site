import React from 'react';
import PropTypes from 'prop-types';
import { matchPath, useLocation, useHistory } from 'react-router-dom';
import IconSearch from 'terra-icon/lib/icon/IconSearch';
import IconTile from 'terra-icon/lib/icon/IconTile';
import { PrimaryNavigationLayout, NavigationItem } from '@cerner/terra-application/lib/layouts';

import DevSitePage from '../pages/_DevSitePage';
import NotFoundPage from '../pages/_NotFoundPage';

import siteConfigPropType from '../site/siteConfigPropTypes';
import DevSiteSecondaryNavigation from './_DevSiteSecondaryNavigationLayout';

const Search = React.lazy(() => import('../search/_Search'));

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

class DevSiteNavigation2 extends React.Component {
  static propExistsAndChanged(nextProp, currentProp) {
    return nextProp !== undefined && nextProp !== currentProp;
  }

  static getActiveNavigationItemPath(location, navigationItems) {
    for (let i = 0, numberOfNavigationItems = navigationItems.length; i < numberOfNavigationItems; i += 1) {
      if (matchPath(location.pathname, navigationItems[i].path)) {
        return navigationItems[i].path;
      }
    }

    return undefined;
  }

  static getDerivedStateFromProps(newProps) {
    return {
      activeNavigationItemPath: DevSiteNavigation.getActiveNavigationItemPath(newProps.location, newProps.siteConfig.navigationItems),
    };
  }

  static launchExtension(key, disclosureManager, { Component, props = {}, size = 'large' }) {
    disclosureManager.disclose({
      preferredType: 'modal',
      size,
      content: {
        key,
        component: <Component {...props} />,
      },
    });
  }

  static launchAppSwitcher(key, { disclosureManager, siteConfig }) {
    disclosureManager.disclose({
      preferredType: 'modal',
      size: 'tiny',
      content: {
        key,
        component: (
          <ApplicationSwitcher apps={siteConfig.apps} />
        ),
      },
    });
  }

  static getUtilityItems(appsConfig) {
    const utilityItems = [];
    if (appsConfig.length > 0) {
      utilityItems.push({
        icon: <IconTile />,
        key: 'terra-dev-site.application-switcher',
        text: 'Application Switcher',
        metaData: { func: DevSiteNavigation.launchAppSwitcher },
      });
    }
    return utilityItems;
  }

  constructor(props) {
    super(props);
    this.state = {
      activeNavigationItemPath: undefined,
    };

    this.handleNavigationItemSelection = this.handleNavigationItemSelection.bind(this);
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.handleExtensionSelection = this.handleExtensionSelection.bind(this);
    this.handleSettingsSelection = this.handleSettingsSelection.bind(this);
  }

  getExtensionItems() {
    const { history, fetchSearchItems } = this.props;
    const { extensions } = this.props.siteConfig;
    const searchExtension = {
      icon: <IconSearch />,
      key: 'terra-dev-site.search',
      text: 'Search',
      metaData: {
        Component: ExtensionWrapper,
        size: 'large',
        props: {
          content: Search,
          props: { fetchSearchItems, onItemSelected: path => history.push(path) },
        },
      },
    };

    const extensionArray = fetchSearchItems ? [searchExtension] : [];

    return extensions.reduce((acc, ext) => acc.concat({
      icon: <ext.icon />,
      key: ext.key,
      text: ext.text,
      metaData: {
        Component: ExtensionWrapper,
        size: ext.size,
        props: { content: ext.component },
      },
    }), extensionArray);
  }

  handleNavigationItemSelection(navigationItemKey) {
    const { history } = this.props;
    const { activeNavigationItemPath } = this.state;

    if (activeNavigationItemPath !== navigationItemKey) {
      history.push(navigationItemKey);
    }
  }

  handleItemSelection(key, metaData) {
    metaData.func(key, this.props);
  }

  handleExtensionSelection(key, metaData) {
    DevSiteNavigation.launchExtension(key, this.props.disclosureManager, metaData);
  }

  handleSettingsSelection() {
    const { disclosureManager } = this.props;
    disclosureManager.disclose({
      preferredType: 'modal',
      size: 'small',
      content: {
        key: 'terra-dev-site.settings',
        component: (
          <SettingsPicker />
        ),
      },
    });
  }

  render() {
    const { applicationNavigation } = this.props;
    const {
      nameConfig, navigationItems, contentConfig, indexPath, placeholderSrc, menuItems, capabilities, apps,
    } = this.props.siteConfig;
    const { activeNavigationItemPath } = this.state;

    if (!activeNavigationItemPath) {
      return <NotFoundPage homePath={indexPath} />;
    }

    return (
      <>
        {
          applicationNavigation({
            titleConfig: {
              title: nameConfig.title,
              ...nameConfig.headline && { headline: nameConfig.headline },
              ...nameConfig.subline && { subline: nameConfig.subline },
            },
            navigationItems: navigationItems.map(item => ({
              key: item.path,
              text: item.text,
            })),
            extensionItems: this.getExtensionItems(),
            onSelectExtensionItem: this.handleExtensionSelection,
            activeNavigationItemKey: activeNavigationItemPath,
            onSelectNavigationItem: this.handleNavigationItemSelection,
            onSelectSettings: this.handleSettingsSelection,
            utilityItems: DevSiteNavigation.getUtilityItems(apps),
            onSelectUtilityItem: this.handleItemSelection,
            child: (
              <DevSitePage
                placeholderSrc={placeholderSrc}
                menuItems={menuItems[activeNavigationItemPath]}
                pageContent={contentConfig[activeNavigationItemPath]}
                rootPath={activeNavigationItemPath}
                key={activeNavigationItemPath}
                notFoundComponent={<NotFoundPage indexPath={indexPath} />}
                capabilities={capabilities}
              />
            ),
          })
        }
      </>
    );
  }
}

const DevSiteNavigation = ({ siteConfig }) => {
  const location = useLocation();
  const history = useHistory();

  // Redirect hacking this logic might be better added to the site.
  // const pathWithoutTrailingSlash = location.pathname.length !== 1 && location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
  // const primaryNavPath = siteConfig.primaryNavPathToFirstPagePathMap[pathWithoutTrailingSlash];

  // if (primaryNavPath) {
  //   console.log('replacing ', location.pathname, ' with ', primaryNavPath);
  //   history.replace(primaryNavPath);
  // }
  // end

  const setNavigationState = (key) => {
    history.push(key);
  };
  console.log('location', location);

  const firstDir = () => `/${location.pathname.split('/')[1]}`;

  return (
    <PrimaryNavigationLayout
      titleConfig={siteConfig.nameConfig}
      activeNavigationKey={firstDir()}
      onSelectNavigationItem={(key) => { setNavigationState(key); }}
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
        // if there is one item and it is not a directory don't show secondary

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
  );
};

DevSiteNavigation.propTypes = propTypes;
DevSiteNavigation.defaultProps = defaultProps;

export default DevSiteNavigation;
