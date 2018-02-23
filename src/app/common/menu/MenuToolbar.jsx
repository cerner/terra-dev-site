import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';

import IconLeft from 'terra-icon/lib/icon/IconLeft';
import IconHouse from 'terra-icon/lib/icon/IconHouse';
import Button from 'terra-button';

import RoutingStackDelegate from 'terra-navigation-layout/lib/RoutingStackDelegate';
import styles from './MenuToolbar.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The AppDelegate instance provided by the containing component. If present, its properties will propagate to the children components.
   */
  app: PropTypes.object,
  /**
   * The RoutingStateDelegate instance provided by the terra-navigation-layout.
   */
  routingStackDelegate: RoutingStackDelegate.propType,
  /**
   * The tab label provided by the navigation link text.
   */
  text: PropTypes.string,
};

const defaultProps = {
  app: undefined,
  routingStackDelegate: undefined,
  text: null,
};

const MenuToolbar = ({ app, routingStackDelegate, text, ...customProps }) => {
  const toolbarClassNames = cx([
    'menu-toolbar',
    { 'is-terminal': !routingStackDelegate.showParent },
    customProps.className,
  ]);

  let backButton;
  if (routingStackDelegate.showParent) {
    backButton = (
      <Button
        onClick={routingStackDelegate.showParent}
        text="back"
        icon={<IconLeft />}
        variant="utility"
        style={{ color: 'black' }}
      />);
  }

  let rootButton;
  if (routingStackDelegate.showRoot) {
    rootButton = (
      <Button
        onClick={routingStackDelegate.showRoot}
        text="root"
        icon={<IconHouse />}
        variant="utility"
        style={{ color: 'black' }}
      />);
  }

  const toolbarStart = (
    <div className={cx(['menu-toolbar-start'])}>
      {backButton}
      {rootButton}
    </div>
  );

  const toolbarEnd = (
    <div className={cx(['menu-toolbar-end'])} />
  );

  return (
    <div {...customProps} className={cx(['menu-toolbar-flex-wrapper'])}>
      <div className={toolbarClassNames}>
        {toolbarStart}
        <div className={cx(['menu-toolbar-body'])}>
          <h3 style={{ margin: '0' }}>{text}</h3>
        </div>
        {toolbarEnd}
      </div>
    </div>
  );
};


MenuToolbar.propTypes = propTypes;
MenuToolbar.defaultProps = defaultProps;

export default MenuToolbar;
