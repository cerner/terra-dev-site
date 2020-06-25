import React from 'react';
import classNames from 'classnames/bind';
import IconChevronRight from 'terra-icon/lib/icon/IconChevronRight';
import styles from './example2.scss';

const cx = classNames.bind(styles);

const TagComp = () => (
  <h1>
    I am a test
    <IconChevronRight className={cx('chevron')} />
  </h1>
);

export default TagComp;
