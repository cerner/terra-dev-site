import React from 'react';
import { matchPath, Route } from 'react-router-dom';

const RawRoute = ({ routingConfig, location, prefix }) => (
  <Route
    path={prefix}
    render={() => {
      const flattenedRouteConfig = Object.keys(routingConfig).reduce((allRoutes, pageKey) => allRoutes.concat(routingConfig[pageKey]), []);

      const routes = Object.keys(flattenedRouteConfig).sort().reverse();
      const nonRawPath = location.pathname.substring(prefix.length);

      const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

      if (route) {
        const routeData = flattenedRouteConfig[route].component.default;
        const ComponentClass = routeData.componentClass;
        const componentProps = routeData.props;

        return <ComponentClass {...componentProps} />;
      }
      return 404;
    }}
  />
);

export default RawRoute;
