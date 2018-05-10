import React from 'react';
import { matchPath } from 'react-router-dom';

const RawRoute = (routingConfig, location, prefix) => {
  const routes = Object.keys(routingConfig.content).sort().reverse();
  const nonRawPath = location.pathname.substring(prefix.length);

  const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

  if (route) {
    const routeData = routingConfig.content[route].component.default;
    // const ComponentClass = routeData.componentClass;
    const ComponentClass = routeData.props.content;
    const componentProps = routeData.props.props;
    // const componentProps = Object.assign({}, routeData.props, { pathRoot: `${prefix}${route}` });
    return <ComponentClass {...componentProps} />;
  }
  return 404;
};

export default RawRoute;
