import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Utils } from 'terra-application-layout';

import styles from './Extensions.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The children list items passed to the component.
   */
  children: PropTypes.node,
  layoutConfig: Utils.propTypes.layoutConfigPropType,
};

const defaultProps = {
  children: [],
  layoutConfig: undefined,
};

const Extensions = (props) => {
  const { children, layoutConfig } = props;
  const isCompactSize = Utils.helpers.isSizeCompact(layoutConfig.size);

  let containerProps = { className: cx('container') }
  if (isCompactSize) {
    containerProps = {
      className: cx('container-compact'),
    };
  }

  const wrappedChildren = children.map((child) =>(
    <div className={cx('item')}>
        {child}
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

export default Extensions;
