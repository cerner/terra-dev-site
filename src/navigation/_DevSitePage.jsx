import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Switch, Route,
} from 'react-router-dom';
import Application from 'terra-application';
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/appConfig';
import ContentContainer from 'terra-content-container';

import SecondaryNavigationLayout from './_SecondaryNavigationLayout';
import Placeholder from '../static-pages/_PlaceholderPage';
import { withAppSettings } from './_AppSettingsContext';
import ComponentToolbar from './_ComponentToolbar';

const { settingsConfig, capabilities } = siteConfig;

const propTypes = {
  rootPath: PropTypes.string.isRequired,
  placeholderSrc: PropTypes.string.isRequired,
  notFoundComponent: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageContent: PropTypes.object.isRequired,
  menuItems: PropTypes.PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,

  appSettings: PropTypes.shape({
    locale: PropTypes.string,
    theme: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
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
    const { location, pageContent, rootPath } = this.props;
    const { theme, locale } = this.state;
    const config = pageContent[location.pathname];
    if (!config || !capabilities[rootPath].devToolbar) {
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
      pageContent, rootPath, placeholderSrc, notFoundComponent,
    } = this.props;
    const { sortedContentPaths, theme, locale } = this.state;

    return (
      <Application
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
      </Application>
    );
  }

  render() {
    const { history, menuItems, location } = this.props;
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
        selectedMenuItemKey={location.pathname}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          const { appSettings } = this.state;
          this.setState({
            theme: appSettings.theme,
            locale: appSettings.locale,
          });

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
