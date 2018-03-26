import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath, Switch, Route } from 'react-router-dom';

import Base from 'terra-base';
import ThemeProvider from 'terra-theme-provider';
import ApplicationLayout from 'terra-application-layout';

import siteConfig from '../config/site.config';
import ConfigureUtilities from './ConfigureUtilities';
import './App.scss';

const propTypes = {
  /**
   * The title branding of the site.
   */
  nameConfig: PropTypes.object,
  /**
   * Configuration to setup the utilities menu.
   */
  utilityConfig: PropTypes.object,
  /**
  * The configuration Object that will be used to generate the specified regions of the terra-navigation-layout.
  * Note: The config prop is treated as an immutable object to prevent unnecessary processing and improve performance.
  * If the configuration is changed after the first render, a new configuration object instance must be provided.
  */
  routingConfig: PropTypes.object.isRequired,
  /**
   * The navigaion links to display within the menu in the toolbar.
   */
  navigationItems: PropTypes.array,
  /**
   * React object to display in the utilities area in the application layout.
   */
  extensions: PropTypes.object,
  /**
   * The path to the sites index.
   */
  indexPath: PropTypes.string.isRequired,
  /**
  * The locale the site should default to.
   */
  defaultLocale: PropTypes.string,
  /**
   * The directionality the site should default to. Either 'ltr' or 'rtl'.
   */
  defaultDir: PropTypes.string,
  /**
   * The theme the site should default to.
   */
  defaultTheme: PropTypes.string,
  /**
   * Injected by react-routed: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const appConfig = siteConfig.appConfig;

const defaultProps = {
  nameConfig: undefined,
  defaultDir: undefined,
  defaultTheme: undefined,
  defaultLocale: undefined,
  navigationItems: undefined,
  extensions: undefined,
  routingConfig: undefined,
  utilityConfig: undefined,
  location: undefined,
};

class App extends React.Component {

  static propExistsAndChanged(nextProp, currentProp) {
    return nextProp !== undefined && nextProp !== currentProp;
  }

  constructor(props) {
    super(props);
    this.state = {
      dir: props.defaultDir,
      locale: props.defaultLocale,
      theme: props.defaultTheme,
    };
    this.handleBidiChange = this.handleBidiChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);

    this.utilityConfig = this.setupUtilityConfig(props.utilityConfig);
  }

  componentWillReceiveProps(nextProps) {
    if (App.propExistsAndChanged(nextProps.defaultLocale, this.props.defaultLocale)) {
      document.getElementsByTagName('html')[0].setAttribute('lang', nextProps.defaultLocale);
      this.setState({ locale: nextProps.defaultLocale });
    }

    if (App.propExistsAndChanged(nextProps.defaultTheme, this.props.defaultTheme)) {
      this.setState({ theme: nextProps.defaultTheme });
    }

    if (App.propExistsAndChanged(nextProps.defaultDir, this.props.defaultDir)) {
      document.getElementsByTagName('html')[0].setAttribute('dir', nextProps.defaultDir);
      this.setState({ dir: nextProps.defaultDir });
    }

    this.utilityConfig = this.setupUtilityConfig(nextProps.utilityConfig);
  }

  setupUtilityConfig(utilityConfig) {
    return ConfigureUtilities.addCallbackFunctions(
      utilityConfig,
      {
        Theme: { onChange: this.handleThemeChange },
        Locale: { onChange: this.handleLocaleChange },
        Bidi: { onChange: this.handleBidiChange },
      });
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
    const { nameConfig, location, routingConfig, navigationItems, indexPath, extensions } = this.props;
    const { theme, locale, dir } = this.state;
    this.utilityConfig = ConfigureUtilities.updateSelectedItems(this.utilityConfig, theme, locale, dir);

    // console.log('utilityConfig', this.utilityConfig);
    // console.log('nav config', this.props.navigation);
    // console.log('rootPath', this.props.rootPath);
    // console.log('routeConfig', this.props.routeConfig);

    return (
      <ThemeProvider id="site" themeName={appConfig.themes[theme]} isGlobalTheme>
        <Base className="base" locale={locale}>
          <Switch>
            <Route
              render={() => <ApplicationLayout
                nameConfig={nameConfig}
                utilityConfig={ConfigureUtilities.convertChildkeysToArray(this.utilityConfig)}
                routingConfig={routingConfig}
                navigationItems={!matchPath(location.pathname, '/tests') ? navigationItems : undefined}
                extensions={extensions}
                indexPath={indexPath}
                navigationAlignment="start"
              />}
            />
          </Switch>
        </Base>
      </ThemeProvider>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withRouter(App);
