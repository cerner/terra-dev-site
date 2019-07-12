/* global TERRA_DEV_SITE_BASENAME */
// TERRA_DEV_SITE_BASENAME is defined by webpack
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
// This line will be resolved by webpack
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/appConfig';
import ApplicationBase from 'terra-application';
import ModalManager from 'terra-application/lib/modal-manager';

import DevSiteNavigation from './navigation/_DevSiteNavigation';
import Raw from './raw/_Raw';
import AppSettingsContext from './navigation/_AppSettingsContext';
import TerraMdxProvider from './mdx/_TerraMdxProvider';

import './index.scss';

class DevSiteApplication extends React.Component {
  /**
   * Redirect the page to one of the routes reserved for the additional apps
   * @param {*} props.match the current matching route
   */
  static redirectToReservedRoute({ match }) {
    window.sessionStorage.redirect = window.location.href;
    window.location.pathname = `${TERRA_DEV_SITE_BASENAME}${match.url}/`;
    return null;
  }

  /**
   * Redirect the page to the version of the page without the root hash route
   * @param {*} props.location the current location
   */
  static redirectSlashRoute({ location }) {
    // if a hash route is passed in, we're going to redirect to avoid breaking existing tests.
    if (location.hash.startsWith('#/')) {
      return <Redirect to={`/${location.hash.slice(2)}`} />;
    }
    return <Redirect to={siteConfig.indexPath} />;
  }

  constructor(props) {
    super(props);

    this.syncDomWithState = this.syncDomWithState.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);

    const {
      defaultLocale: locale = 'en',
      defaultTheme: theme,
      defaultDirection: direction = 'ltr',
    } = siteConfig.settingsConfig;

    this.state = {
      locale,
      theme,
      direction,
    };
  }

  componentDidMount() {
    this.syncDomWithState();
  }

  componentDidUpdate() {
    this.syncDomWithState();
  }

  /**
   * Handle setting update and store new settings in state.
   * @param {*} newSettings
   */
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

  /**
   * Place settings on dom
   */
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

    const settings = {
      locales: siteConfig.settingsConfig.locales,
      selectedLocale: locale,
      themes: Object.keys(siteConfig.settingsConfig.themes),
      selectedTheme: theme,
      directions: siteConfig.settingsConfig.directions,
      selectedDirection: direction,
    };

    return (
      // TERRA_DEV_SITE_BASENAME is expected to be '' or '/*'
      <BrowserRouter basename={TERRA_DEV_SITE_BASENAME}>
        <Switch>
          <Route exact path="/" render={DevSiteApplication.redirectSlashRoute} />
          { siteConfig.apps.map(app => <Route path={`/${app.path}`} key={app.path} render={DevSiteApplication.redirectToReservedRoute} />)}
          <Route>
            <AppSettingsContext.Provider value={this.state}>
              <ApplicationBase
                locale={locale}
                themeName={siteConfig.settingsConfig.themes[theme]}
                themeIsGlobal
              >
                <TerraMdxProvider>
                  <ModalManager>
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
                          menuItems={siteConfig.menuItems}
                          placeholderSrc={siteConfig.placeholderSrc}
                          navigationItems={siteConfig.navigationItems}
                          indexPath={siteConfig.indexPath}
                          extensionConfig={siteConfig.extensions}
                          appsConfig={siteConfig.apps}
                        />
                      </Route>
                    </Switch>
                  </ModalManager>
                </TerraMdxProvider>
              </ApplicationBase>
            </AppSettingsContext.Provider>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<DevSiteApplication />, document.getElementById('root'));
