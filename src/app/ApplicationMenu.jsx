import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import RoutingStackDelegate from 'terra-navigation-layout/lib/RoutingStackDelegate';

import MenuList from './common/menu/MenuList';

const propTypes = {
  /**
   * The component header.
   */
  menuHeader: PropTypes.string,
  /**
   * The navigaion links to display within the toolbar.
   */
  links: PropTypes.array,
  /**
   * The RoutingStateDelegate instance provided by the terra-navigation-layout.
   */
  routingStackDelegate: RoutingStackDelegate.propType,
};

const defaultProps = {
  menuHeader: null,
  links: undefined,
  routingStackDelegate: undefined,
};

const ApplicationMenu = ({ menuHeader, links, routingStackDelegate }) => (
  <MenuList
    headerText={menuHeader}
    routingStackDelegate={routingStackDelegate}
    links={links}
  />
);

ApplicationMenu.propTypes = propTypes;
ApplicationMenu.defaultProps = defaultProps;

export default withRouter(ApplicationMenu);
