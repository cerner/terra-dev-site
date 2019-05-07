import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, matchPath, Redirect,
} from 'react-router-dom';
import { DisclosureManager } from 'terra-application';
import ApplicationNavigation from 'terra-application-navigation';
import Image from 'terra-image';

import DevSitePage from './_DevSitePage';
import SettingsPicker from './_SettingsPicker';
import NotFoundPage from '../static-pages/_NotFoundPage';

const propTypes = {
  /**
   * The title branding of the site.
   */
  nameConfig: PropTypes.shape({
    accessory: PropTypes.element,
    title: PropTypes.string,
  }),
  /**
   * Configuration to setup the utilities menu.
   */
  settingsConfig: PropTypes.shape({
    themes: PropTypes.shape({
      default: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
    }),
    locales: PropTypes.shape({
      default: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
    }),
    directions: PropTypes.shape({
      default: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  onUpdateSettings: PropTypes.func,
  contentConfig: PropTypes.shape({
    placeholder: PropTypes.node,
    content: PropTypes.object,
    menuItems: PropTypes.object,
  }).isRequired,
  /**
   * The navigaion links to display within the menu in the toolbar.
   */
  // eslint-disable-next-line react/forbid-prop-types
  navigationItems: PropTypes.array,
  /**
   * The path to the sites index.
   */
  indexPath: PropTypes.string.isRequired,
  /**
   * The theme the site should default to.
   */
  defaultTheme: PropTypes.string,
  /**
   * The themes the site could use.
   */
  // eslint-disable-next-line react/forbid-prop-types
  themes: PropTypes.object,
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
  nameConfig: undefined,
  defaultTheme: undefined,
  themes: undefined,
  navigationItems: undefined,
  settingsConfig: undefined,
  location: undefined,
  history: undefined,
  onUpdateSettings: undefined,
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
      activeNavigationItemPath: DevSiteNavigation.getActiveNavigationItemPath(newProps.location, newProps.navigationItems),
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

  constructor(props) {
    super(props);
    this.state = {
      activeNavigationItemPath: undefined,
    };

    this.handleNavigationItemSelection = this.handleNavigationItemSelection.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;
    DevSiteNavigation.scrollToALink(location);
  }

  handleNavigationItemSelection(navigationItemKey) {
    const { history } = this.props;
    const { activeNavigationItemPath } = this.state;

    if (activeNavigationItemPath !== navigationItemKey) {
      history.push(navigationItemKey);
    }
  }

  render() {
    const {
      nameConfig, navigationItems, contentConfig, indexPath, disclosureManager, settingsConfig, onUpdateSettings, location,
    } = this.props;
    const { activeNavigationItemPath } = this.state;

    if (!activeNavigationItemPath) {
      if (location.pathname === '/') {
        // if a hash route is passed in, we're going to redirect to avoid breaking existing tests.
        if (location.hash.startsWith('#/')) {
          return <Redirect to={`/${location.hash.slice(2)}`} />;
        }
        return <Redirect to={indexPath} />;
      }

      return <NotFoundPage homePath={indexPath} />;
    }

    const pageMenuItems = contentConfig.menuItems[activeNavigationItemPath];
    const pageContent = contentConfig.content[activeNavigationItemPath];

    return (
      <ApplicationNavigation
        titleConfig={{
          title: nameConfig.title,
        }}
        navigationItems={navigationItems.map(item => ({
          key: item.path,
          text: item.text,
        }))}
        activeNavigationItemKey={activeNavigationItemPath}
        onSelectNavigationItem={this.handleNavigationItemSelection}
        drawerMenuHero={<Image src={contentConfig.placeholderSrc} style={{ height: '50px', width: '50px' }} />}
        utilityMenuHero={<Image src={contentConfig.placeholderSrc} style={{ height: '50px', width: '50px' }} />}
        onSelectSettings={() => {
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
        }}
      >
        <DevSitePage
          placeholderSrc={contentConfig.placeholderSrc}
          menuItems={pageMenuItems}
          contentConfig={pageContent}
          rootPath={activeNavigationItemPath}
          key={activeNavigationItemPath}
          notFoundComponent={<NotFoundPage indexPath={indexPath} />}
        />
      </ApplicationNavigation>
    );
  }
}

DevSiteNavigation.propTypes = propTypes;
DevSiteNavigation.defaultProps = defaultProps;

export default DisclosureManager.withDisclosureManager(withRouter(DevSiteNavigation));
