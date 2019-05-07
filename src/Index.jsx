/* global TERRA_DEV_SITE_BASENAME */
// TERRA_DEV_SITE_BASENAME is defined by webpack
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// This line will be resolved by webpack
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/appConfig';
import Application from 'terra-application';
import DevSiteNavigation from './navigation/_DevSiteNavigation';
import Raw from './raw/_Raw';
import './index.scss';

class DevSiteApplication extends React.Component {
  static redirectToReservedRoute({ match }) {
    window.sessionStorage.redirect = window.location.href;
    window.location.pathname = match.url;
    return null;
  }

  constructor(props) {
    super(props);

    this.syncDomWithState = this.syncDomWithState.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);

    const initialLocale = (siteConfig.settingsConfig && siteConfig.settingsConfig.locales.default) || 'en';
    const initialTheme = siteConfig.settingsConfig && siteConfig.settingsConfig.themes && siteConfig.settingsConfig.themes.default;
    const initialDirection = (siteConfig.settingsConfig && siteConfig.settingsConfig.directions.default) || 'ltr';

    this.state = {
      locale: initialLocale,
      theme: initialTheme,
      direction: initialDirection,
    };
  }

  componentDidMount() {
    this.syncDomWithState();
  }

  componentDidUpdate() {
    this.syncDomWithState();
  }

  onUpdateSettings(newSettings) {
    const { locale, theme, direction } = this.state;
    const newState = {};
    if (newSettings.locale && locale !== newSettings.locale) {
      newState.locale = newSettings.locale;
    }

    if (newSettings.theme && theme !== newSettings.theme) {
      newState.theme = newSettings.theme;
    }

    if (newSettings.direction && direction !== newSettings.direction) {
      newState.direction = newSettings.direction;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  syncDomWithState() {
    const { locale, direction } = this.state;

    const htmlNode = document.getElementsByTagName('html')[0];

    if (htmlNode.getAttribute('lang') !== locale) {
      htmlNode.setAttribute('lang', locale);
    }

    if (htmlNode.getAttribute('dir') !== direction) {
      htmlNode.setAttribute('dir', direction);
    }
  }

  render() {
    const { locale, theme, direction } = this.state;

    const settings = {};
    if (siteConfig.settingsConfig.locales) {
      settings.locales = {
        values: siteConfig.settingsConfig.locales.values,
        selectedValue: locale,
      };
    }

    if (siteConfig.settingsConfig.themes) {
      settings.themes = {
        values: siteConfig.settingsConfig.themes.values,
        selectedValue: theme,
      };
    }

    if (siteConfig.settingsConfig.directions) {
      settings.directions = {
        values: siteConfig.settingsConfig.directions.values,
        selectedValue: direction,
      };
    }

    return (
      // TERRA_DEV_SITE_BASENAME is expected to be '' or '/*'
      <BrowserRouter basename={TERRA_DEV_SITE_BASENAME}>
        <Switch>
          { siteConfig.apps.map(app => <Route path={`/${app.path}`} key={app.path} render={DevSiteApplication.redirectToReservedRoute} />)}
          <Route>
            <Application
              locale={locale}
              themeName={siteConfig.themes[theme]}
              themeIsGlobal
            >
              <Switch>
                <Route path="/raw">
                  <Raw
                    contentConfig={siteConfig.contentConfig}
                    indexPath={siteConfig.indexPath}
                  />
                </Route>
                <Route>
                  <DevSiteNavigation
                    nameConfig={siteConfig.nameConfig}
                    settingsConfig={settings}
                    onUpdateSettings={this.onUpdateSettings}
                    contentConfig={siteConfig.contentConfig}
                    navigationItems={siteConfig.navigationItems}
                    indexPath={siteConfig.indexPath}
                    themes={siteConfig.themes}
                    direction={direction}
                  />
                </Route>
              </Switch>
            </Application>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<DevSiteApplication />, document.getElementById('root'));
