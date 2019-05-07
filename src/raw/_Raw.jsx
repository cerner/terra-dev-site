import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';
import NotFoundPage from '../static-pages/_NotFoundPage';

const propTypes = {
  /**
   * The path to the sites index.
   */
  contentConfig: PropTypes.shape({
    placeholder: PropTypes.node,
    content: PropTypes.object,
    menuItems: PropTypes.object,
  }).isRequired,
  /**
   * The path to the sites index.
   */
  indexPath: PropTypes.string.isRequired,
  /**
   * Injected by react-router: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const defaultProps = {
  location: undefined,
};


const Raw = ({ indexPath, contentConfig, location }) => {
  const flattenedRouteConfig = Object.keys(contentConfig.content).reduce((allRoutes, pageKey) => Object.assign(allRoutes, contentConfig.content[pageKey]), {});

  const routes = Object.keys(flattenedRouteConfig).sort().reverse();
  const nonRawPath = location.pathname.substring(4);

  const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

  if (route) {
    const routeData = flattenedRouteConfig[route].component.default;
    return React.createElement(routeData.componentClass, routeData.props);
  }

  return <NotFoundPage homePath={indexPath} />;
};

Raw.propTypes = propTypes;
Raw.defaultProps = defaultProps;

export default withRouter(Raw);
