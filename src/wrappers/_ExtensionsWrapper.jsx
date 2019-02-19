import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Breakpoints } from 'terra-application';

import styles from './ExtensionsWrapper.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The children extension items passed to the component.
   */
  children: PropTypes.node,
  /**
   * The active window breakpoint. This should be provided automatically by a parent ActiveBreakpointProvider.
   */
  activeBreakpoint: PropTypes.string,
};

const defaultProps = {
  children: [],
  activeBreakpoint: undefined,
};

const ExtensionsWrapper = (props) => {
  const { children, activeBreakpoint } = props;
  const isCompactSize = activeBreakpoint === 'tiny' || activeBreakpoint === 'small' || activeBreakpoint === 'medium';

  let containerProps = { className: cx('container') };
  if (isCompactSize) {
    containerProps = {
      className: cx('container-compact'),
    };
  }

  const wrappedChildren = React.Children.map(children, child => (
    <div className={cx('item')}>
      { child }
    </div>
  ));

  return (
    <div {...containerProps}>
      {wrappedChildren}
    </div>
  );
};

ExtensionsWrapper.propTypes = propTypes;
ExtensionsWrapper.defaultProps = defaultProps;

export default Breakpoints.withActiveBreakpoint(ExtensionsWrapper);
