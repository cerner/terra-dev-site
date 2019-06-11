import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Switch, Route,
} from 'react-router-dom';
import Application from 'terra-application';
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/appConfig';

import SecondaryNavigationLayout from './_SecondaryNavigationLayout';
import Placeholder from '../static-pages/_PlaceholderPage';
import TerraMdxProvider from '../mdx/_TerraMdxProvider';
import ComponentToolbar from './_ComponentToolbar';
import { withAppSettings } from './_AppSettingsContext';

const propTypes = {
  rootPath: PropTypes.string.isRequired,
  placeholderSrc: PropTypes.string.isRequired,
  notFoundComponent: PropTypes.node.isRequired,
  contentConfig: PropTypes.shape({
    placeholder: PropTypes.node,
    content: PropTypes.object,
    menuItems: PropTypes.object,
  }).isRequired,
  menuItems: PropTypes.PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })).isRequired,
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
    const { appSettings, location, contentConfig } = props;

    this.generateContent = this.generateContent.bind(this);
    this.handleThemeSelection = this.handleThemeSelection.bind(this);
    this.handleLocaleSelection = this.handleLocaleSelection.bind(this);

    this.state = {
      appSettings,
      locale: appSettings.locale,
      theme: appSettings.theme,
      initialSelectedMenuKey: location.pathname,
      sortedContentPaths: Object.keys(contentConfig).sort().reverse(),
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
      contentConfig, rootPath, placeholderSrc, notFoundComponent,
    } = this.props;
    const { sortedContentPaths } = this.state;

    return (
      <Switch>
        {sortedContentPaths.map(path => (
          <Route
            key={path}
            path={path}
            render={() => React.createElement(contentConfig[path].component.default.componentClass, contentConfig[path].component.default.props)}
          />
        ))}
        <Route
          path={rootPath}
          exact
          render={() => <Placeholder src={placeholderSrc} />}
        />
        <Route render={() => notFoundComponent} />
      </Switch>
    );
  }

  renderToolbar() {
    const { location, contentConfig } = this.props;
    const { theme, locale } = this.state;
    const config = contentConfig[location.pathname];
    if (!config) {
      return null;
    }
    const { pageType } = config;
    if (!pageType || (siteConfig.pageTypeCapabilities[pageType] && siteConfig.pageTypeCapabilities[pageType].disableComponentToolbar)) {
      return null;
    }

    return (
      <ComponentToolbar
        config={{
          themes: Object.keys(siteConfig.settingsConfig.themes),
          locales: siteConfig.settingsConfig.locales,
        }}
        selectedLocale={locale}
        onChangeLocale={this.handleLocaleSelection}
        selectedTheme={theme}
        onChangeTheme={this.handleThemeSelection}
      />
    );
  }

  render() {
    const { history, menuItems } = this.props;
    const { initialSelectedMenuKey, theme, locale } = this.state;

    if (!menuItems || !menuItems[0].childItems) {
      return this.generateContent();
    }

    return (
      <SecondaryNavigationLayout
        menuItems={menuItems}
        initialSelectedMenuItemKey={initialSelectedMenuKey}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          const { appSettings } = this.state;
          this.setState({
            theme: appSettings.theme,
            locale: appSettings.locale,
          });

          history.push(metaData.path);
        }}
        key={initialSelectedMenuKey}
        headerToolbar={this.renderToolbar()}
      >
        <Application
          locale={locale}
          themeName={siteConfig.settingsConfig.themes[theme]}
        >
          <TerraMdxProvider>
            {this.generateContent()}
          </TerraMdxProvider>
        </Application>
      </SecondaryNavigationLayout>
    );
  }
}

DevSitePage.propTypes = propTypes;

export default withAppSettings(withRouter(DevSitePage));
