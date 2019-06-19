import React from 'react';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import { disclosureManagerShape, withDisclosureManager } from 'terra-application/lib/disclosure-manager';
import StatusView from 'terra-status-view';

const propTypes = {
  /**
   * Injected by disclosure manager
   */
  disclosureManager: disclosureManagerShape.isRequired,
};

const TestExtension = ({ disclosureManager }) => (
  <ContentContainer
    header={(
      <>
        <ActionHeader
          title="Test Extension"
          onBack={disclosureManager.goBack}
          onClose={disclosureManager.closeDisclosure}
        />
      </>
    )}
    fill
  >
    <StatusView variant="no-data" />
  </ContentContainer>
);

TestExtension.propTypes = propTypes;

export default withDisclosureManager(TestExtension);
