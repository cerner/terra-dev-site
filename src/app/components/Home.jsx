import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'terra-markdown';

const propTypes = {
  /**
   * The homepage README markdown source.
   */
  readMeSrc: PropTypes.string,
};

const defaultProps = {
  readMeSrc: '',
};

const Home = ({ readMeSrc }) => (
  <div style={{ height: '100%', padding: '15px', overflow: 'auto' }}>
    <Markdown src={readMeSrc} />
  </div>
);

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
