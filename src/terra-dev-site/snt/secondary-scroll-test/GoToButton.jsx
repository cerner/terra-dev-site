import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const propTypes = {
  /**
   * path to navigate to
   */
  path: PropTypes.string,
  /**
   * Injected by react-router: the object representing browser history.
   */
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object,
};

const defaultProps = {
  history: undefined,
};

const goToClick = (path, history) => {
  history.push(path);
};

const GoToButton = (props) => {
  const {
    path,
    history,
  } = props;

  let temp;
  if (history) {
    temp = (
      <button className="GoToButton" onClick={() => { goToClick(path, history); }} >
        Push me
      </button>
    );
  }

  return (
    <>
      {temp}
    </>
  );
};

GoToButton.propTypes = propTypes;
GoToButton.defaultProps = defaultProps;

export default withRouter(GoToButton);
