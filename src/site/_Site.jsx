/* global TERRA_DEV_SITE_BASENAME */
// TERRA_DEV_SITE_BASENAME is defined by webpack
import React from 'react';
import {
  BrowserRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ModalManager from 'terra-application/lib/modal-manager';

import DevSiteNavigation from '../navigation/_DevSiteNavigation';
import Raw from '../raw/_Raw';
import AppSettingsContext from '../navigation/_AppSettingsContext';
import siteConfigPropType from './siteConfigPropTypes';
import TerraMdxProvider from '../mdx/_TerraMdxProvider';

import './site.module.scss';

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  applicationBase: PropTypes.func.isRequired,

  applicationNavigation: PropTypes.func.isRequired,

  basename: PropTypes.string.isRequired,

  siteConfig: siteConfigPropType.isRequired,

  fetchSearchItems: PropTypes.func.isRequired,
};

class Site extends React.Component {
  /**
   * Redirect the page to one of the routes reserved for the additional apps
   * @param {*} props.match the current matching route
   */
  static redirectToReservedRoute({ match }) {
    window.sessionStorage.redirect = window.location.href;
    window.location.pathname = `${TERRA_DEV_SITE_BASENAME}${match.url}/`;
    return null;
  }

  constructor(props) {
    super(props);

    this.syncDomWithState = this.syncDomWithState.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);

    const {
      defaultLocale: locale = 'en',
      defaultTheme: theme,
      defaultDirection: direction = 'ltr',
    } = props.siteConfig.settingsConfig;

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

  /**
   * Redirect the page to the version of the page without the root hash route
   * @param {*} props.location the current location
   */
  redirectSlashRoute({ location }) {
    const { siteConfig } = this.props;
    // if a hash route is passed in, we're going to redirect to avoid breaking existing tests.
    if (location.hash.startsWith('#/')) {
      return <Redirect to={`/${location.hash.slice(2)}`} />;
    }
    return <Redirect to={siteConfig.indexPath} />;
  }

  renderApplicationBaseChildren() {
    const { siteConfig, applicationNavigation, fetchSearchItems } = this.props;
    return (
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
                siteConfig={siteConfig}
                onUpdateSettings={this.onUpdateSettings}
                applicationNavigation={applicationNavigation}
                fetchSearchItems={fetchSearchItems}
              />
            </Route>
          </Switch>
        </ModalManager>
      </TerraMdxProvider>
    );
  }

  render() {
    const { locale, theme } = this.state;
    const { applicationBase, siteConfig, basename } = this.props;

    return (
      // basename is expected to be '' or '/*'
      <BrowserRouter basename={basename}>
        <Switch>
          <Route exact path="/" render={Site.redirectSlashRoute} />
          { siteConfig.apps.map(app => <Route path={`/${app.path}`} key={app.path} render={Site.redirectToReservedRoute} />)}
          <Route>
            <AppSettingsContext.Provider value={this.state}>
              {
                applicationBase({
                  locale,
                  themeName: siteConfig.settingsConfig.themes[theme],
                  child: this.renderApplicationBaseChildren(),
                })
              }
            </AppSettingsContext.Provider>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

Site.propTypes = propTypes;

export default Site;
