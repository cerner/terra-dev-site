import React from 'react';
import PropTypes from 'prop-types';
import StatusView from 'terra-status-view';

const propTypes = {
  error: PropTypes.string.isRequired,
};

const ErrorPage = ({ error }) => (
  <StatusView
    variant="error"
    title="Error"
    message={error}
    buttonAttrs={[
      {
        text: 'Refresh',
        key: 'Refresh',
        onClick: () => { window.location.reload(true); },
      },
    ]}
  />
);

ErrorPage.propTypes = propTypes;

export default ErrorPage;
