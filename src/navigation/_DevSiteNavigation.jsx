import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';
import { withDisclosureManager, disclosureManagerShape } from 'terra-application/lib/disclosure-manager';
// import Image from 'terra-image';
import IconTile from 'terra-icon/lib/icon/IconTile';
import IconSearch from 'terra-icon/lib/icon/IconSearch';

import DevSitePage from './_DevSitePage';
import SettingsPicker from './_SettingsPicker';
import ApplicationSwitcher from './_ApplicationSwitcher';
import Search from './_Search';
import NotFoundPage from '../static-pages/_NotFoundPage';
import siteConfigPropType from '../site/siteConfigPropTypes';

const propTypes = {
  onUpdateSettings: PropTypes.func,
  basename: PropTypes.string.isRequired,
  applicationNavigation: PropTypes.func.isRequired,
  fetchSearchItems: PropTypes.func.isRequired,
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

  siteConfig: siteConfigPropType.isRequired,

  disclosureManager: disclosureManagerShape.isRequired,
};

const defaultProps = {
  location: undefined,
  history: undefined,
};

class DevSiteNavigation extends React.Component {
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

  static scrollToALink(location) {
    if (!location || location.length < 2) {
      return;
    }
    const elementName = location.hash.slice(1);
    const element = document.getElementsByName(elementName);
    if (element[0]) {
      element[0].scrollIntoView();
    }
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

  static launchAppSwitcher(key, { disclosureManager, siteConfig, basename }) {
    disclosureManager.disclose({
      preferredType: 'modal',
      size: 'tiny',
      content: {
        key,
        component: (
          <ApplicationSwitcher apps={siteConfig.apps} basename={basename} />
        ),
      },
    });
  }

  static generateUtilityItems(appsConfig) {
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

  componentDidMount() {
    const { location } = this.props;
    DevSiteNavigation.scrollToALink(location);
  }

  getExtensionItems() {
    const { history, fetchSearchItems } = this.props;
    const { extensions } = this.props.siteConfig;
    const searchExtension = {
      icon: <IconSearch />,
      key: 'terra-dev-site.search',
      text: 'Search',
      metaData: {
        Component: Search,
        size: 'large',
        props: { fetchSearchItems, onItemSelected: path => history.push(path) },
      },
    };

    return extensions.reduce((acc, ext) => acc.concat({
      icon: <ext.icon />,
      key: ext.key,
      text: ext.text,
      metaData: {
        Component: ext.component,
        size: ext.size,
      },
    }), [searchExtension]);
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
    const { disclosureManager, onUpdateSettings } = this.props;
    const { settingsConfig } = this.props.siteConfig;
    disclosureManager.disclose({
      preferredType: 'modal',
      size: 'small',
      content: {
        key: 'terra-dev-site.settings',
        component: (
          <SettingsPicker
            config={settingsConfig}
            onChangeSettings={(settingsValues, dismissSettingsPicker) => {
              dismissSettingsPicker().then(() => {
                if (onUpdateSettings) {
                  onUpdateSettings(settingsValues);
                }
              });
            }}
          />
        ),
      },
    });
  }

  render() {
    const { applicationNavigation } = this.props;
    const {
      nameConfig, navigationItems, contentConfig, indexPath, apps, placeholderSrc, menuItems, settingsConfig, capabilities,
    } = this.props.siteConfig;
    const { activeNavigationItemPath } = this.state;

    if (!activeNavigationItemPath) {
      return <NotFoundPage homePath={indexPath} />;
    }

    return (
      <>
        {
          applicationNavigation({
            titleConfig: { title: nameConfig.title },
            navigationItems: navigationItems.map(item => ({
              key: item.path,
              text: item.text,
            })),
            extensionItems: this.getExtensionItems(),
            onSelectExtensionItem: this.handleExtensionSelection,
            activeNavigationItemKey: activeNavigationItemPath,
            onSelectNavigationItem: this.handleNavigationItemSelection,
            // hero={<Image src={placeholderSrc} style={{ height: '50px', width: '50px' }} />}
            onSelectSettings: this.handleSettingsSelection,
            utilityItems: DevSiteNavigation.generateUtilityItems(apps),
            onSelectUtilityItem: this.handleItemSelection,
            child: (
              <DevSitePage
                placeholderSrc={placeholderSrc}
                menuItems={menuItems[activeNavigationItemPath]}
                pageContent={contentConfig[activeNavigationItemPath]}
                rootPath={activeNavigationItemPath}
                key={activeNavigationItemPath}
                notFoundComponent={<NotFoundPage indexPath={indexPath} />}
                settingsConfig={settingsConfig}
                capabilities={capabilities}
              />
            ),
          })
        }
      </>
    );
  }
}

DevSiteNavigation.propTypes = propTypes;
DevSiteNavigation.defaultProps = defaultProps;

export default withDisclosureManager(withRouter(DevSiteNavigation));
