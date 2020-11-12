import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApplicationContainer from '@cerner/terra-application/lib/application-container/ApplicationContainer';

import { titleConfigPropType } from './siteConfigPropTypes';

const propTypes = {
  /**
   * The A session provider
   */
  children: PropTypes.node,
  /**
   * The title config for the app, used for the container's application name.
   */
  titleConfig: titleConfigPropType.isRequired,
};

const DevSiteApplicationContainer = ({ titleConfig, children }) => {
  const isRaw = useRouteMatch('/raw');
  return (
    <ApplicationContainer applicationName={titleConfig.titleConfig} skipToLinksAreDisabled={!!isRaw} unloadPromptIsDisabled={!!isRaw}>
      {children}
    </ApplicationContainer>
  );
};

DevSiteApplicationContainer.propTypes = propTypes;

export default DevSiteApplicationContainer;
