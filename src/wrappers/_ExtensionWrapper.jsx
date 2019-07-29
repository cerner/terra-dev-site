import React from 'react';
import PropTypes from 'prop-types';
import ActionHeader from 'terra-action-header';
import ContentContainer from 'terra-content-container';
import { withDisclosureManager } from 'terra-application/lib/disclosure-manager';

import CodesplitWrapper from './_CodesplitWrapper';
import LoadingPage from '../static-pages/_LoadingPage';

const ErrorWrapper = withDisclosureManager(({ children, disclosureManager }) => (
  <ContentContainer
    header={(
      <ActionHeader
        title="Error"
        onBack={disclosureManager.goBack}
        onClose={disclosureManager.closeDisclosure}
      />
    )}
    fill
  >
    {children}
  </ContentContainer>
));

const Fallback = withDisclosureManager(({ disclosureManager }) => (
  <ContentContainer
    header={(
      <ActionHeader
        title="Loading"
        onBack={disclosureManager.goBack}
        onClose={disclosureManager.closeDisclosure}
      />
    )}
    fill
  >
    <LoadingPage />
  </ContentContainer>
));

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
    fallback={<Fallback />}
    errorWrapper={ErrorWrapper}
  />
);

ExtensionWrapper.propTypes = propTypes;
ExtensionWrapper.defaultProps = defaultProps;

export default ExtensionWrapper;
