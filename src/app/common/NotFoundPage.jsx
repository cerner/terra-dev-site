import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

const propTypes = {
};


const NotFoundPage = ({ history, homePath }) => (
  <div>
    <h2>404</h2>
    {history.length > 1 ? <button onClick={() => { history.goBack(); }}>Back</button> : null}
    <Link to={homePath}>Home</Link>
  </div>
);

NotFoundPage.propTypes = propTypes;

export default withRouter(NotFoundPage);
