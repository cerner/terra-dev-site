import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';

import Base from 'terra-base';
import ThemeProvider from 'terra-theme-provider';
import ApplicationLayout from 'terra-application-layout';

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

  constructor(props) {
    super(props);
    this.state = {
      dir: document.getElementsByTagName('html')[0].getAttribute('dir'),
      locale: document.getElementsByTagName('html')[0].getAttribute('lang'),
      theme: props.defaultTheme,
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
      nameConfig, location, routingConfig, navigationItems, indexPath, extensions, themes,
    } = this.props;
    const { theme, locale, dir } = this.state;
    this.utilityConfig = ConfigureUtilities.updateSelectedItems(this.utilityConfig, theme, locale, dir);

    return (
      <ThemeProvider id="site" themeName={themes[theme]} isGlobalTheme>
        <Base className="base" locale={locale}>
          <Switch>
            <Route
              path="/raw"
              render={() => RawRoute(routingConfig, location, '/raw')}
            />
            <Route
              render={() => (<ApplicationLayout
                nameConfig={nameConfig}
                utilityConfig={ConfigureUtilities.convertChildkeysToArray(this.utilityConfig)}
                routingConfig={routingConfig}
                navigationItems={navigationItems}
                extensions={extensions}
                indexPath={indexPath}
                navigationAlignment="start"
              />)}
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
