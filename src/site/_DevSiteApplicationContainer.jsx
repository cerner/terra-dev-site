import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApplicationContainer from '@cerner/terra-application/lib/application-container/ApplicationContainer';

import { titleConfigShape } from './siteConfigShapes';

const propTypes = {
  /**
   * The remainder of the application to render.
   */
  children: PropTypes.node,
  /**
   * The title config for the app, used for the container's application name.
   */
  titleConfig: titleConfigShape.isRequired,
};

const DevSiteApplicationContainer = ({ titleConfig, children }) => {
  const isRaw = useRouteMatch('/raw');
  return (
    <ApplicationContainer applicationName={titleConfig.title} skipToLinksAreDisabled={!!isRaw} unloadPromptIsDisabled={!!isRaw}>
      {children}
    </ApplicationContainer>
  );
};

DevSiteApplicationContainer.propTypes = propTypes;

export default DevSiteApplicationContainer;
