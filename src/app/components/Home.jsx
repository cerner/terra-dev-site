import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'terra-markdown';
import styles from './Home.scss';

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
  <div className={styles.home}>
    <Markdown src={readMeContent} />
  </div>
);

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
