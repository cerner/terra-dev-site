import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MarkdownTags.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  Tag: PropTypes.string,
  props: PropTypes.shape({
    className: PropTypes.string,
    children: PropTypes.node,
  }),
};

const TagComp = ({ Tag, props: componentProps }) => (
  <Tag {...componentProps} className={[cx(Tag), componentProps.className].join(' ')}>
    { componentProps.children }
  </Tag>
);

TagComp.propTypes = propTypes;

export default TagComp;
