import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApplicationContainer from '@cerner/terra-application/lib/application-container/ApplicationContainer';

const propTypes = {
  /**
   * The A session provider
   */
  children: PropTypes.node,
};

const Site = ({ children }) => {
  const isRaw = useRouteMatch('/raw');
  return (
    <ApplicationContainer skipToLinksAreDisabled={!!isRaw} unloadPromptIsDisabled={!!isRaw}>
      {children}
    </ApplicationContainer>
  );
};

Site.propTypes = propTypes;

export default Site;
