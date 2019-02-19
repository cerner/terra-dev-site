import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import StatusView from 'terra-status-view';
import Button from 'terra-button';

const propTypes = {
  history: PropTypes.object,
  homePath: PropTypes.string,
};

const NotFoundPage = ({ history, homePath }) => (
  <div>
    <StatusView
      variant="error"
      title="404"
      message="Page not found"
    >
      <Button text="Go Back" onClick={() => { history.goBack(); }} />
      <Button text="Home" onClick={() => { history.replace(homePath); }} />
    </StatusView>
  </div>
);

NotFoundPage.propTypes = propTypes;

export default withRouter(NotFoundPage);
