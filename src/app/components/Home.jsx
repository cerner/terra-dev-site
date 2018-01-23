import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'terra-markdown';

const propTypes = {
  /**
   * The homepage README markdown content.
   */
  readMeContent: PropTypes.string,
};

const defaultProps = {
  readMeContent: '',
};

const Home = ({ readMeContent }) => (
  <div style={{ height: '100%', padding: '15px', overflow: 'auto' }}>
    <Markdown src={readMeContent} />
  </div>
);

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
