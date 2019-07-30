import React from 'react';
import PropTypes from 'prop-types';
import ActionHeader from 'terra-action-header';
import ContentContainer from 'terra-content-container';
import { DisclosureManagerContext } from 'terra-application/lib/disclosure-manager';

import CodesplitWrapper from './_CodesplitWrapper';
import LoadingPage from '../static-pages/_LoadingPage';

// eslint-disable-next-line react/prop-types
const ExtensionShell = ({ title, children }) => {
  const disclosureManager = React.useContext(DisclosureManagerContext);
  return (
    <ContentContainer
      header={(
        <ActionHeader
          title={title}
          onBack={disclosureManager.goBack}
          onClose={disclosureManager.closeDisclosure}
        />
      )}
      fill
    >
      {children}
    </ContentContainer>
  );
};

const ErrorWrapper = props => (
  <ExtensionShell {...props} title="Error" />
);

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  // eslint-disable-next-line react/forbid-prop-types
  content: PropTypes.object.isRequired,
  /**
   * The props to be applied to the content.
   */
  // eslint-disable-next-line react/forbid-prop-types
  props: PropTypes.object,
};

const defaultProps = {
  props: undefined,
};

const ExtensionWrapper = props => (
  <CodesplitWrapper
    {...props}
    fallback={(
      <ExtensionShell title="Loading">
        <LoadingPage />
      </ExtensionShell>
    )}
    errorWrapper={ErrorWrapper}
  />
);

ExtensionWrapper.propTypes = propTypes;
ExtensionWrapper.defaultProps = defaultProps;

export default ExtensionWrapper;
