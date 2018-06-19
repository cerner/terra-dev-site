import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './ContentWrapper.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  content: PropTypes.func,
  /**
   * The props to be applied to the content.
   */
  // eslint-disable-next-line react/forbid-prop-types
  props: PropTypes.object,
};

const defaultProps = {
  content: undefined,
  props: undefined,
};

const ContentWrapper = ({ content: Content, props }) => (
  <div
    data-terra-dev-site-content
    className={cx('site-content')}
  >
    <Content {...props} />
  </div>
);

ContentWrapper.propTypes = propTypes;
ContentWrapper.defaultProps = defaultProps;

export default ContentWrapper;
