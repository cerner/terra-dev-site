import React from 'react';
import PropTypes from 'prop-types';
import List, { Item } from 'terra-list';
import Hyperlink from 'terra-hyperlink';
import ApplicationModal from '@cerner/terra-application/lib/application-modal/ApplicationModal';
import classNamesBind from 'classnames/bind';

import styles from './ApplicationSwitcherModal.module.scss';

const cx = classNamesBind.bind(styles);

const propTypes = {
  /**
   * Apps config
   */
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,

  /**
   * Injected by disclosure manager
   */
  onRequestClose: PropTypes.func.isRequired,
};

const ApplicationSwitcherModal = ({ onRequestClose, apps }) => (
  <ApplicationModal
    title="Application Switcher"
    onRequestClose={onRequestClose}
  >
    <List dividerStyle="bottom-only">
      {apps.map(app => (
        <Item key={app.url}>
          <Hyperlink className={cx('item')} href={app.url}>{app.title}</Hyperlink>
        </Item>
      ))}
    </List>
  </ApplicationModal>
);

ApplicationSwitcherModal.propTypes = propTypes;

export default ApplicationSwitcherModal;
