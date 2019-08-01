import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import StatusView from 'terra-status-view';

const propTypes = {
  /**
   * Injected by react-router: the object representing browser history.
   */
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,

  /**
   * Path to home
   */
  homePath: PropTypes.string.isRequired,
};

const NotFoundPage = ({ history, homePath }) => (
  <div>
    <StatusView
      variant="error"
      title="404"
      message="Page not found"
      buttonAttrs={[
        {
          text: 'Go Back',
          key: 'Go Back',
          onClick: () => { history.goBack(); },
        },
        {
          text: 'Home',
          key: 'Home',
          onClick: () => { history.replace(homePath); },
        },
      ]}
    />
  </div>
);

NotFoundPage.propTypes = propTypes;

export default withRouter(NotFoundPage);
