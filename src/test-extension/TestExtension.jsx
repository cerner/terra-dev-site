import React from 'react';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import { DisclosureManagerContext } from 'terra-application/lib/disclosure-manager';
import StatusView from 'terra-status-view';

const TestExtension = () => {
  const disclosureManager = React.useContext(DisclosureManagerContext);
  return (
    <ContentContainer
      header={(
        <ActionHeader
          title="Test Extension"
          onBack={disclosureManager.goBack}
          onClose={disclosureManager.closeDisclosure}
        />
      )}
      fill
    >
      <StatusView variant="no-data" />
    </ContentContainer>
  );
};

export default TestExtension;
