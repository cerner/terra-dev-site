import React from 'react';
import ApplicationModal from '@cerner/terra-application/lib/application-modal/ApplicationModal';
import ApplicationStatusOverlay from '@cerner/terra-application/lib/application-status-overlay';

const TestExtension = ({onRequestClose}) => (
  <ApplicationModal
    onRequestClose={onRequestClose}
    title="Test Extension"
  >
    <p>nope</p>
    {/* <ApplicationStatusOverlay variant="no-data" /> */}
  </ApplicationModal>
);

export default TestExtension;
