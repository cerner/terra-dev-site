import React from 'react';
import { matchPath } from 'react-router-dom';
import { Consumer } from 'xfc';
import EmbeddedContentConsumer from 'terra-embedded-content-consumer';
import './iframe.module.scss';

Consumer.init();

const EmbeddedRoute = (routingConfig, { location, match }) => {
  const routes = Object.keys(routingConfig.content).sort().reverse();
  const nonRawPath = location.pathname.substring(match.path.length);
  const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

  if (route) {
    return (
      <EmbeddedContentConsumer
        data-terra-dev-site-embedded-content
        style={{ height: 'inheriet', overflow: 'hidden' }}
        src={`/#raw${route}`}
      />
    );
  }

  return 404;
};

export default EmbeddedRoute;
