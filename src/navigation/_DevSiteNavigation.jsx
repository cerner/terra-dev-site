import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Switch, Route, matchPath, Redirect,
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
    menuItems: PropTypes.array,
  }).isRequired,
  /**
   * The navigaion links to display within the menu in the toolbar.
   */
  // eslint-disable-next-line react/forbid-prop-types
  navigationItems: PropTypes.array,
  /**
   * React object to display in the utilities area in the application layout.
   */
  extensions: PropTypes.element,
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
  extensions: undefined,
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

  constructor(props) {
    super(props);
    this.state = {
      activeNavigationItemPath: undefined,
    };

    this.handleNavigationItemSelection = this.handleNavigationItemSelection.bind(this);
    this.renderRawRoute = this.renderRawRoute.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
  }

  handleNavigationItemSelection(navigationItemKey) {
    const { history } = this.props;
    const { activeNavigationItemPath } = this.state;

    if (activeNavigationItemPath !== navigationItemKey) {
      history.push(navigationItemKey);
    }
  }

  renderRawRoute({ location }) {
    const { indexPath, contentConfig } = this.props;

    const flattenedRouteConfig = Object.keys(contentConfig.content).reduce((allRoutes, pageKey) => Object.assign(allRoutes, contentConfig.content[pageKey]), {});

    const routes = Object.keys(flattenedRouteConfig).sort().reverse();
    const nonRawPath = location.pathname.substring(4);

    const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

    if (route) {
      const routeData = flattenedRouteConfig[route].component.default;
      return React.createElement(routeData.componentClass, routeData.props);
    }

    return <NotFoundPage homePath={indexPath} />;
  }

  renderNavigation() {
    const {
      nameConfig, navigationItems, extensions, contentConfig, indexPath, disclosureManager, settingsConfig, onUpdateSettings,
    } = this.props;
    const { activeNavigationItemPath } = this.state;

    const pageMenuItems = contentConfig.menuItems[activeNavigationItemPath];
    const pageContent = contentConfig.content[activeNavigationItemPath];

    return (
      <ApplicationNavigation
        title={nameConfig.title}
        navigationItems={navigationItems.map(item => ({
          key: item.path,
          text: item.text,
        }))}
        activeNavigationItemKey={activeNavigationItemPath}
        onSelectNavigationItem={this.handleNavigationItemSelection}
        // extensions={extensions}
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

  render() {
    const {
      indexPath, location,
    } = this.props;
    const {
      activeNavigationItemPath,
    } = this.state;

    if (!activeNavigationItemPath && !location.pathname.match(/^\/raw/)) {
      if (location.pathname === '/') {
        return <Redirect to={indexPath} />;
      }

      return <NotFoundPage homePath={indexPath} />;
    }

    return (
      <Switch>
        <Route path="/raw" render={this.renderRawRoute} />
        <Route render={this.renderNavigation} />
      </Switch>
    );
  }
}

DevSiteNavigation.propTypes = propTypes;
DevSiteNavigation.defaultProps = defaultProps;

export default DisclosureManager.withDisclosureManager(withRouter(DevSiteNavigation));
