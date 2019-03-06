import React from 'react';
import { matchPath } from 'react-router-dom';
import EmbeddedContentConsumer from 'terra-embedded-content-consumer';
import './iframe.module.scss';

const EmbeddedRoute = (embeddedConfig, routingConfig, { location, match }) => {
  const { generate, ...embeddedContentConsumerProps } = embeddedConfig;

  const routes = Object.keys(routingConfig.content).sort().reverse();
  const nonRawPath = location.pathname.substring(match.path.length);
  const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

  if (route) {
    return (
      <EmbeddedContentConsumer
        {...embeddedContentConsumerProps}
        data-terra-dev-site-embedded-content
        style={{ height: 'inheriet', overflow: 'hidden' }}
        src={`/#raw${route}`}
      />
    );
  }

  return 404;
};

export default EmbeddedRoute;
