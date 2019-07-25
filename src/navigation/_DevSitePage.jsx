import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Switch, Route,
} from 'react-router-dom';
import ApplicationBase from 'terra-application';
import ContentContainer from 'terra-content-container';

import SecondaryNavigationLayout from './_SecondaryNavigationLayout';
import Placeholder from '../static-pages/_PlaceholderPage';
import { withAppSettings } from './_AppSettingsContext';
import { settingsConfigPropType, capabilitiesPropType } from '../site/siteConfigPropTypes';
import ComponentToolbar from './_ComponentToolbar';

const propTypes = {
  /**
   * Root path for the navigation page.
   */
  rootPath: PropTypes.string.isRequired,

  /**
   * Component to be displayed if menu item is found but not content
   */
  placeholderSrc: PropTypes.string.isRequired,

  /**
   * Component to be displayed if the route is not found.
   */
  notFoundComponent: PropTypes.node.isRequired,

  /**
   * Current content on the page
   */
  // eslint-disable-next-line react/forbid-prop-types
  pageContent: PropTypes.object.isRequired,

  /**
   * Config describing the secondary navigation menu
   */
  menuItems: PropTypes.PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })),

  /**
   * The current state of app settings, set by withAppSettings
   */
  appSettings: PropTypes.shape({
    locale: PropTypes.string,
    theme: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,

  /**
   * Application settings, things like locale and theme
   */
  settingsConfig: settingsConfigPropType.isRequired,

  /**
   * capabilities set per root route.
   */
  capabilities: capabilitiesPropType.isRequired,

  /**
   * Injected by react-router: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,

  /**
   * Injected by react-router: the object representing browser history.
   */
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

class DevSitePage extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const newState = {};

    if (state.appSettings.theme !== props.appSettings.theme) {
      newState.appSettings = props.appSettings;
      newState.theme = props.appSettings.theme;
    }

    return newState;
  }

  constructor(props) {
    super(props);
    const { appSettings, location, pageContent } = props;

    this.generateContent = this.generateContent.bind(this);
    this.handleThemeSelection = this.handleThemeSelection.bind(this);
    this.handleLocaleSelection = this.handleLocaleSelection.bind(this);

    this.state = {
      appSettings,
      locale: appSettings.locale,
      theme: appSettings.theme,
      initialSelectedMenuKey: location.pathname,
      sortedContentPaths: Object.keys(pageContent).sort().reverse(),
    };
  }

  getDevToolbarConfig() {
    const {
      rootPath, settingsConfig, capabilities,
    } = this.props;
    const { theme, locale } = this.state;
    if (!capabilities[rootPath].devToolbar) {
      return null;
    }

    const themes = Object.keys(settingsConfig.themes);

    if (settingsConfig.locales.length <= 1 && themes.length <= 1) {
      return null;
    }

    return {
      locales: settingsConfig.locales,
      selectedLocale: locale,
      onChangeLocale: this.handleLocaleSelection,
      themes,
      selectedTheme: theme,
      onChangeTheme: this.handleThemeSelection,
    };
  }

  handleThemeSelection(theme) {
    this.setState({
      theme,
    });
  }

  handleLocaleSelection(locale) {
    this.setState({
      locale,
    });
  }

  generateContent() {
    const {
      pageContent, rootPath, placeholderSrc, notFoundComponent, settingsConfig,
    } = this.props;
    const { sortedContentPaths, theme, locale } = this.state;

    return (
      <ApplicationBase
        locale={locale}
        themeName={settingsConfig.themes[theme]}
      >
        <Switch>
          {sortedContentPaths.map(path => (
            <Route
              key={path}
              path={path}
              render={() => React.createElement(pageContent[path].component.default.componentClass, pageContent[path].component.default.props)}
            />
          ))}
          <Route
            path={rootPath}
            exact
            render={() => <Placeholder src={placeholderSrc} />}
          />
          <Route render={() => notFoundComponent} />
        </Switch>
      </ApplicationBase>
    );
  }

  render() {
    const {
      history, menuItems, location, pageContent,
    } = this.props;
    const { initialSelectedMenuKey } = this.state;

    const devToolbarConfig = this.getDevToolbarConfig();
    if (!menuItems) {
      if (!devToolbarConfig) {
        return this.generateContent();
      }

      return (
        <ContentContainer
          header={(
            <ComponentToolbar devToolbarConfig={devToolbarConfig} />
          )}
          fill
        >
          {this.generateContent()}
        </ContentContainer>
      );
    }

    return (
      <SecondaryNavigationLayout
        menuItems={menuItems}
        isMenuOpen={pageContent[location.pathname] === undefined}
        selectedMenuItemKey={location.pathname}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          history.push(metaData.path);
        }}
        key={initialSelectedMenuKey}
        devToolbarConfig={devToolbarConfig}
      >
        {this.generateContent()}
      </SecondaryNavigationLayout>
    );
  }
}

DevSitePage.propTypes = propTypes;

export default withAppSettings(withRouter(DevSitePage));
