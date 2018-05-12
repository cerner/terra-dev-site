import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
// import 'terra-base/lib/baseStyles';

import styles from './ReactWrapper.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  content: PropTypes.func,

  props: PropTypes.object,
};

const defaultProps = {
  content: undefined,
  props: undefined,
};

const ReactWrapper = ({ content: Content, props }) => {
  const contentClassNames = cx([
    'site-content',
  ]);

  return (
    <div
      data-terra-dev-site-content
      className={contentClassNames}
    >
      <Content {...props} />
    </div>
  );
};

ReactWrapper.propTypes = propTypes;
ReactWrapper.defaultProps = defaultProps;

export default ReactWrapper;
