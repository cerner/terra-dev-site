import React from 'react';
import { matchPath } from 'react-router-dom';

const RawRoute = (routingConfig, location) => {
  const routes = Object.keys(routingConfig.content).sort();
  const nonRawPath = location.pathname.substring(4);

  const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

  if (route) {
    const routeData = routingConfig.content[route].component.default;
    const ComponentClass = routeData.componentClass;
    const componentProps = Object.assign({}, routeData.props, { pathRoot: `/raw${route}` });
    return <ComponentClass {...componentProps} />;
  }
  return 404;
};

export default RawRoute;
