import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
// import 'terra-base/lib/baseStyles';

import styles from './ContentWrapper.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  content: PropTypes.node,

  props: PropTypes.object,
};

const defaultProps = {
  content: undefined,
  props: undefined,
};

const ContentWrapper = ({ content: Content, props }) => {
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

ContentWrapper.propTypes = propTypes;
ContentWrapper.defaultProps = defaultProps;

export default ContentWrapper;
