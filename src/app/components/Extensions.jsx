import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Utils } from 'terra-application-layout';
import { withActiveBreakpoint } from 'terra-breakpoints';

import styles from './Extensions.scss';

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
};

const Extensions = (props) => {
  const { children, activeBreakpoint } = props;
  const isCompactSize = Utils.helpers.isSizeCompact(activeBreakpoint);

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

Extensions.propTypes = propTypes;
Extensions.defaultProps = defaultProps;

export default withActiveBreakpoint(Extensions);
