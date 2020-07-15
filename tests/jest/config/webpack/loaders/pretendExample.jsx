import React from 'react';
import classNames from 'classnames/bind';
import styles from './pretendExampleCss.scss';

const cx = classNames.bind(styles);

const TagComp = () => (
  <h1 className={cx('body')}>
    Test
  </h1>
);

export default TagComp;
