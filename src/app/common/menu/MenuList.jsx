import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { NavLink, withRouter } from 'react-router-dom';
import List from 'terra-list';
import ApplicationMenuLayout from 'terra-application-menu-layout';
import RoutingStackDelegate from 'terra-navigation-layout/lib/RoutingStackDelegate';
import MenuToolbar from './MenuToolbar';

import styles from './MenuList.scss';

const cx = classNames.bind(styles);


const propTypes = {
  /**
   * The RoutingStateDelegate instance provided by the terra-navigation-layout.
   */
  routingStackDelegate: RoutingStackDelegate.propType,
  /**
   * Injected by react-routed: represent where the app is now, where you want it to go,
   * or even where it was.
   * */
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  /**
   * The list of link configuration to build react-router NavLinks provided by the containing component.
   */
  links: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
    text: PropTypes.string,
    hasSubNav: PropTypes.bool,
  })),
  /**
   * The component header provided by the containing component.
   */
  headerText: PropTypes.string,
};

const generateMenuLinks = (links, location) => {
  const navLinks = !!links && links.map(link =>
    <List.Item
      key={link.id}
      hasChevron={link.hasSubNav}
      content={
        <NavLink
          key={link.id}
          className={cx('menu-link')}
          location={location}
          to={link.path}
          activeStyle={{
            fontWeight: 'bold',
          }}
        >
          {link.text}
        </NavLink>}
    />);

  return (<List>{navLinks}</List>);
};

const MenuList = ({ routingStackDelegate, links, headerText, location }) => (
  <ApplicationMenuLayout
    header={<MenuToolbar text={headerText} routingStackDelegate={routingStackDelegate} />}
    content={generateMenuLinks(links, routingStackDelegate.location || location)}
  />
);

MenuList.propTypes = propTypes;

export default withRouter(MenuList);
