import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './MDX.scss';

const cx = classNames.bind(styles);

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: undefined,
};

const components = {
  wrapper: props => (
    <div className={cx(['mdx'])} {...props} />
  ),
  // h1: props => (
  //   <h1 className={'derpface'} {...props}>
  //     { props.children }
  //   </h1>
  // ),
};

const TerraMDXProvider = ({ children }) => (
  <MDXProvider components={components}>
    {children}
  </MDXProvider>
);

TerraMDXProvider.propTypes = propTypes;
TerraMDXProvider.defaultProps = defaultProps;

export default TerraMDXProvider;
