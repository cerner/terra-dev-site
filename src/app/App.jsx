/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';

import Base from 'terra-base';
import Image from 'terra-image';
import i18nSupportedLocales from 'terra-i18n/lib/i18nSupportedLocales';
import ThemeProvider from 'terra-theme-provider';
import NavigationLayout from 'terra-navigation-layout';

import ApplicationHeader from './ApplicationHeader';
import './App.scss';

const propTypes = {
  /**
   * The title branding of the site.
   */
  appTitle: PropTypes.string,
  /**
   * The subtitle to be appended to the title.
   */
  appSubtitle: PropTypes.string,
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
  /**
   * The root path for the site.
   */
  rootPath: PropTypes.string.isRequired,
  /**
   * The theme options the site should display in the locale utility in the toobar.
   */
  themes: PropTypes.object,
  /**
  * The locale options the site should display in the locale utility in the toobar.
   // we should check these values are contained in i18nSupportedLocales
   */
  locales: PropTypes.array,
  /**
   * Whether or not to display the directionality utility in the toolbar.
   */
  hideBidiUtility: PropTypes.bool,
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

const defaultProps = {
  appTitle: '',
  appSubtitle: '',
  appLogoSrc: undefined,
  navigation: undefined,
  hideBidiUtility: false,
  defaultDir: 'ltr',
  defaultTheme: 'Default Theme',
  themes: {
    'Default Theme': '',
  },
  locales: i18nSupportedLocales,
  location: undefined,
};

const locale = document.getElementsByTagName('html')[0].getAttribute('lang');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dir: props.defaultDir,
      locale,
      theme: props.defaultTheme,
    };
    this.handleBidiChange = this.handleBidiChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
  }

  handleBidiChange(e) {
    document.getElementsByTagName('html')[0].setAttribute('dir', e.currentTarget.id);
    this.setState({ dir: e.currentTarget.id });
  }

  handleLocaleChange(e) {
    this.setState({ locale: e.currentTarget.id });
  }

  handleThemeChange(e) {
    this.setState({ theme: e.currentTarget.id });
  }

  render() {
    let appLogo;
    if (this.props.appLogoSrc) {
      appLogo = (<Image variant="rounded" src={this.props.appLogoSrc} height="26px" width="26px" isFluid />);
    }

    let applicationHeader;
    if (matchPath(this.props.location.pathname, this.props.rootPath)) {
      applicationHeader = (
        <ApplicationHeader
          title={this.props.appTitle}
          subtitle={this.props.appSubtitle}
          logo={appLogo}
          locale={this.state.locale}
          locales={this.props.locales}
          onLocaleChange={this.handleLocaleChange}
          hideBidiUtility={this.props.hideBidiUtility}
          dir={this.state.dir}
          onDirChange={this.handleBidiChange}
          theme={this.state.theme}
          themes={Object.keys(this.props.themes)}
          onThemeChange={this.handleThemeChange}
          navigation={this.props.navigation}
        />
      );
    }

    return (
      <ThemeProvider id="site" themeName={this.props.themes[this.state.theme]} isGlobalTheme>
        <Base className="base" locale={this.state.locale}>
          <NavigationLayout
            header={applicationHeader}
            menuText="Menu"
            indexPath={this.props.navigation && this.props.navigation.index}
            config={this.props.routeConfig}
          />
        </Base>
      </ThemeProvider>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withRouter(App);
