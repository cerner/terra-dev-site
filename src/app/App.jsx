import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Switch, Route, matchPath,
} from 'react-router-dom';

import Base from 'terra-base';
import { ActiveBreakpointProvider } from 'terra-breakpoints';
import ThemeProvider from 'terra-theme-provider';
import ApplicationLayout from 'terra-application-layout';
import ModalManager from 'terra-modal-manager';
import NavigationLayout from 'terra-navigation-layout';

import ConfigureUtilities from './ConfigureUtilities';
import RawRoute from './components/RawRoute';
import './App.scss';

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
  utilityConfig: PropTypes.shape({
    title: PropTypes.string,
    accessory: PropTypes.element,
    onChange: PropTypes.func.isRequired,
    menuItems: PropTypes.object.isRequired,
    initialSelectedKey: PropTypes.string.isRequired,
  }),
  /**
  * The configuration Object that will be used to generate the specified regions of the terra-navigation-layout.
  * Note: The config prop is treated as an immutable object to prevent unnecessary processing and improve performance.
  * If the configuration is changed after the first render, a new configuration object instance must be provided.
  */
  // eslint-disable-next-line react/forbid-prop-types
  routingConfig: PropTypes.object.isRequired,
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
   * Injected by react-routed: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const defaultProps = {
  nameConfig: undefined,
  defaultTheme: undefined,
  themes: undefined,
  navigationItems: undefined,
  extensions: undefined,
  utilityConfig: undefined,
  location: undefined,
};

class App extends React.Component {
  static propExistsAndChanged(nextProp, currentProp) {
    return nextProp !== undefined && nextProp !== currentProp;
  }

  static getActiveNavigationItem(location, navigationItems) {
    for (let i = 0, numberOfNavigationItems = navigationItems.length; i < numberOfNavigationItems; i += 1) {
      if (matchPath(location.pathname, navigationItems[i].path)) {
        return navigationItems[i];
      }
    }

    return undefined;
  }

  static getDerivedStateFromProps(newProps) {
    return {
      activeNavigationItemKey: App.getActiveNavigationItem(newProps.location, newProps.navigationItems),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      dir: document.getElementsByTagName('html')[0].getAttribute('dir'),
      locale: document.getElementsByTagName('html')[0].getAttribute('lang'),
      theme: props.defaultTheme,
      menuIsOpen: false,
      activeNavigationItem: '/home',
    };
    this.handleBidiChange = this.handleBidiChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);

    this.utilityConfig = this.setupUtilityConfig(props.utilityConfig);
  }

  setupUtilityConfig(utilityConfig) {
    return ConfigureUtilities.addCallbackFunctions(
      utilityConfig,
      {
        Theme: { onChange: this.handleThemeChange },
        Locale: { onChange: this.handleLocaleChange },
        Bidi: { onChange: this.handleBidiChange },
      },
    );
  }

  handleBidiChange(key) {
    document.getElementsByTagName('html')[0].setAttribute('dir', key);
    this.setState({ dir: key });
  }

  handleLocaleChange(key) {
    document.getElementsByTagName('html')[0].setAttribute('lang', key);
    this.setState({ locale: key });
  }

  handleThemeChange(key) {
    this.setState({ theme: key });
  }

  render() {
    const {
      nameConfig, location, routingConfig, navigationItems, indexPath, extensions, themes, history,
    } = this.props;
    const {
      theme, locale, dir, menuIsOpen, activeNavigationItem,
    } = this.state;
    this.utilityConfig = ConfigureUtilities.updateSelectedItems(this.utilityConfig, theme, locale, dir);

    return (
      <ThemeProvider id="site" themeName={themes[theme]} isGlobalTheme>
        <Base className="base" locale={locale}>
          <ActiveBreakpointProvider>
            <ModalManager>
              <Switch>
                <Route
                  path="/raw"
                  render={() => RawRoute(routingConfig, location, '/raw')}
                />
                <Route
                  render={() => (
                    <ApplicationLayout
                      menuIsOpen={menuIsOpen}
                      onMenuToggle={() => {
                        this.setState(state => ({
                          menuIsOpen: !state.menuIsOpen,
                        }));
                      }}
                      nameConfig={nameConfig}
                      utilityConfig={ConfigureUtilities.convertChildkeysToArray(this.utilityConfig)}
                      routingConfig={routingConfig}
                      navigationItems={navigationItems.map(item => ({
                        key: item.path,
                        text: item.text,
                      }))}
                      activeNavigationItemKey={activeNavigationItem}
                      onSelectNavigationItem={(navigationItemKey) => {
                        if (activeNavigationItem !== navigationItemKey) {
                          if (this.state.menuIsOpen) {
                            this.setState({
                              menuIsOpen: false,
                            }, () => {
                              history.push(navigationItemKey);
                            });
                          } else {
                            history.push(navigationItemKey);
                          }
                        }
                      }}
                      extensions={extensions}
                      navigationAlignment="start"
                    >
                      <NavigationLayout
                        config={routingConfig}
                        indexPath="/home"
                      />
                    </ApplicationLayout>
                  )}
                />
              </Switch>
            </ModalManager>
          </ActiveBreakpointProvider>
        </Base>
      </ThemeProvider>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withRouter(App);
