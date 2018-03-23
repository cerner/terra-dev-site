/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';
import { Switch, Route } from 'react-router';

import Base from 'terra-base';
import Image from 'terra-image';
import ThemeProvider from 'terra-theme-provider';
import ApplicationLayout from 'terra-application-layout';
// import { UtilityUtils } from 'terra-application-utility';
// import NavigationLayout from 'terra-navigation-layout';

import siteConfig from '../config/site.config';
// import ApplicationHeader from './ApplicationHeader';
import ConfigureUtilities from './ConfigureUtilities';
import './App.scss';

const propTypes = {
  /**
   * The title branding of the site.
   */
  appTitle: PropTypes.string,
  /**
   * The source of the logo element to be placed at the start of the toolbar.
   */
  appLogoSrc: PropTypes.string,
  /**
  * The configuration Object that will be used to generate the specified regions of the terra-navigation-layout.
  * Note: The config prop is treated as an immutable object to prevent unnecessary processing and improve performance.
  * If the configuration is changed after the first render, a new configuration object instance must be provided.
  */
  routeConfig: PropTypes.object.isRequired,
  /**
   * The navigaion links to display within the menu in the toolbar.
   */
  navigation: PropTypes.object.isRequired,

  utilConfig: PropTypes.object,
  /**
   * The root path for the site.
   */
  rootPath: PropTypes.string.isRequired,
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
  appTitle: appConfig.title,
  appLogoSrc: appConfig.logoSrc,
  defaultDir: appConfig.defaultDirection,
  defaultTheme: appConfig.defaultTheme,
  defaultLocale: appConfig.defaultLocale,
  utilConfig: undefined,
  location: undefined,
};

class App extends React.Component {
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
    this.handleMenuOnChange = this.handleMenuOnChange.bind(this);

    this.utilConfig = ConfigureUtilities.addCallbackFunctions(props.utilConfig, this.handleMenuOnChange, {
      Theme: { onChange: this.handleThemeChange },
      Locale: { onChange: this.handleLocaleChange },
      Bidi: { onChange: this.handleBidiChange },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultLocale !== undefined && nextProps.defaultLocale !== this.props.defaultLocale) {
      // document.getElementsByTagName('html')[0].setAttribute('lang', nextProps.defaultLocale);
      this.setState({ locale: nextProps.defaultLocale });
    }

    if (nextProps.defaultTheme !== undefined && nextProps.defaultTheme !== this.props.defaultTheme) {
      this.setState({ theme: nextProps.defaultTheme });
    }

    if (nextProps.defaultDir !== undefined && nextProps.defaultDir !== this.props.defaultDir) {
      // document.getElementsByTagName('html')[0].setAttribute('dir', nextProps.defaultDir);
      this.setState({ dir: nextProps.defaultDir });
    }

    this.utilConfig = ConfigureUtilities.addCallbackFunctions(nextProps.utilConfig, this.handleMenuOnChange, {
      Theme: { onChange: this.handleThemeChange },
      Locale: { onChange: this.handleLocaleChange },
      Bidi: { onChange: this.handleBidiChange },
    });
  }

  handleBidiChange(key) {
    // document.getElementsByTagName('html')[0].setAttribute('dir', e.currentTarget.id);
    this.setState({ dir: key });
  }

  handleLocaleChange(key) {
    // document.getElementsByTagName('html')[0].setAttribute('lang', e.currentTarget.id);
    this.setState({ locale: key });
  }

  handleThemeChange(key) {
    this.setState({ theme: key });
  }

  handleMenuOnChange(event, { key, metaData }) {
    // console.log('event', event);
    // console.log('itemKey:', key);
    // console.log('metaData:', metaData);
    metaData.onChange(key);
  }

  render() {
    // console.log('state:', this.state);
    this.utilConfig = ConfigureUtilities.updateSelectedItems(this.utilConfig, this.state.theme, this.state.locale, this.state.dir);
    let appLogo;
    if (this.props.appLogoSrc) {
      appLogo = (<Image variant="rounded" src={this.props.appLogoSrc} height="26px" width="26px" isFluid />);
    }

    const nameConfig = {
      accessory: appLogo,
      title: this.props.appTitle,
    };

    // console.log('nav config', this.props.navigation);
    // console.log('rootPath', this.props.rootPath);
    // console.log('routeConfig', this.props.routeConfig);
    // console.log('utilConfig', this.utilConfig);

    return (
      <ThemeProvider id="site" themeName={appConfig.themes[this.state.theme]} isGlobalTheme>
        <Base className="base" locale={this.state.locale}>
          <Switch>
            <Route path="/raw/tests" component={this.props.routeConfig.content['/tests'].component.default.componentClass} />
            <Route
              render={() => <ApplicationLayout
                nameConfig={nameConfig}
                utilityConfig={ConfigureUtilities.convertChildkeysToArray(this.utilConfig)}
                routingConfig={this.props.routeConfig}
                navigationItems={!matchPath(this.props.location.pathname, '/tests') ? this.props.navigation.links : undefined}
                extensions={this.props.navigation.extensions}
                indexPath={this.props.navigation.index}
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
