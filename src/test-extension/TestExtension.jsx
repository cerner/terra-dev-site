import React from 'react';
import PropTypes from 'prop-types';
import ApplicationModal from '@cerner/terra-application/lib/application-modal/ApplicationModal';
import ApplicationStatusOverlay from '@cerner/terra-application/lib/application-status-overlay';

const propTypes = {
  /**
   * Function called to request closing the modal
   */
  onRequestClose: PropTypes.func.isRequired,
};

const TestExtension = ({ onRequestClose }) => (
  <ApplicationModal
    onRequestClose={onRequestClose}
    title="Test Extension"
  >
    <p>nope</p>
    {/* <ApplicationStatusOverlay variant="no-data" /> */}
  </ApplicationModal>
);

TestExtension.propTypes = propTypes;

export default TestExtension;
