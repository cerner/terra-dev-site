import React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ModalManager from 'terra-application/lib/modal-manager';

import DevSiteNavigation from '../navigation/_DevSiteNavigation';
import Raw from '../raw/_Raw';
import AppSettingsContext from '../navigation/_AppSettingsContext';
import AppSettingsProvider from '../navigation/_AppSettingsProvider';
import siteConfigPropType from './siteConfigPropTypes';
import TerraMdxProvider from '../mdx/_TerraMdxProvider';

import './site.module.scss';
import getSessionStorage from '../session';

const propTypes = {
  /**
   * Render prop for rendering terra-application-base or a variant of it.
   */
  applicationBase: PropTypes.func.isRequired,

  /**
   * Render prop for rendering application navigation or a variant of it.
   */
  applicationNavigation: PropTypes.func.isRequired,

  /**
   * The site config for the application.
   */
  siteConfig: siteConfigPropType.isRequired,

  /**
   * function to return search items
   */
  fetchSearchItems: PropTypes.func,
};

class Site extends React.Component {
  constructor(props) {
    super(props);

    this.redirectSlashRoute = this.redirectSlashRoute.bind(this);
    this.redirectToReservedRoute = this.redirectToReservedRoute.bind(this);
  }

  /**
   * Redirect the page to one of the routes reserved for the additional apps
   * @param {*} props.match the current matching route
   */
  redirectToReservedRoute({ match }) {
    const { siteConfig } = this.props;
    if (getSessionStorage() !== undefined) {
      window.sessionStorage.redirect = window.location.href;
    }
    window.location.pathname = `${siteConfig.basename}${match.url}/`;
    return null;
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
    const {
      siteConfig, applicationNavigation, fetchSearchItems,
    } = this.props;
    return (
      <Switch>
        <Route exact path="/" render={this.redirectSlashRoute} />
        { siteConfig.apps.map(app => app.path && <Route path={`/${app.path}`} key={app.path} render={this.redirectToReservedRoute} />)}
        <Route>
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
                    applicationNavigation={applicationNavigation}
                    fetchSearchItems={fetchSearchItems}
                  />
                </Route>
              </Switch>
            </ModalManager>
          </TerraMdxProvider>
        </Route>
      </Switch>
    );
  }

  render() {
    const { applicationBase, siteConfig } = this.props;

    return (
      <AppSettingsProvider settingsConfig={siteConfig.settingsConfig}>
        <AppSettingsContext.Consumer>
          {({ currentLocale, currentThemeName }) => (
            applicationBase({
              locale: currentLocale,
              themeName: currentThemeName,
              child: this.renderApplicationBaseChildren(),
            })
          )}
        </AppSettingsContext.Consumer>
      </AppSettingsProvider>
    );
  }
}

Site.propTypes = propTypes;

export default Site;
