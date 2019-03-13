import React from 'react';
import { matchPath } from 'react-router-dom';

const RawRoute = (routingConfig, { location, match }) => {
  const routes = Object.keys(routingConfig.content).sort().reverse();
  const nonRawPath = location.pathname.substring(match.path.length);

  const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

  if (route) {
    const routeData = routingConfig.content[route].component.default;
    const ComponentClass = routeData.componentClass;
    const componentProps = routeData.props;

    return <ComponentClass {...componentProps} />;
  }
  return 404;
};

export default RawRoute;
