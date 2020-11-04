import React from 'react';
import {
  useLocation, useRouteMatch, Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import siteConfigPropType from './siteConfigPropTypes';
import getSessionStorage from '../session';

const propTypes = {

  /**
   * The site config for the application.
   */
  routesMap: siteConfigPropType.isRequired,
};

const DevSiteRouter = ({
  basename,
  apps,
  routesMap,
  children,
}) => {
  const isRoot = useRouteMatch('/');
  const location = useLocation();

  // Remove # Route if at root.
  if (isRoot && location.hash.startsWith('#/')) {
    return <Redirect to={`/${location.hash.slice(2)}`} />;
  }

  // Redirect to reserved routes other apps.
  const reservedExternalApp = apps.find((app) => location.pathname.startsWith(`/${app.path}`));

  if (reservedExternalApp) {
    if (getSessionStorage() !== undefined) {
      window.sessionStorage.redirect = window.location.href;
    }
    window.location.pathname = reservedExternalApp.url;
    return null;
  }

  // Redirect to exact path from
  const pathWithoutTrailingSlash = location.pathname.length !== 1 && location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
  const primaryNavPath = routesMap[pathWithoutTrailingSlash];

  if (primaryNavPath) {
    return <Redirect to={primaryNavPath} />;
  }

  return (children);
};

DevSiteRouter.propTypes = propTypes;

export default DevSiteRouter;
