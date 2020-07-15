/* eslint-disable import/no-absolute-path */
import React from 'react';
import classNames from 'classnames/bind';
// eslint-disable-next-line import/no-unresolved
import styles from './pretendExampless.scss';

const cx = classNames.bind(styles);

const TagComp = () => (
  <h1 className={cx('body')}>
    Test
  </h1>
);

export default TagComp;
