import React from 'react';
import PropTypes from 'prop-types';
import List, { Item } from 'terra-list';
import Hyperlink from 'terra-hyperlink';
import ApplicationModal from '@cerner/terra-application/lib/application-modal/ApplicationModal';
import classNamesBind from 'classnames/bind';

import { sitesPropType } from '../site/siteConfigPropTypes';

import styles from './ApplicationSwitcherModal.module.scss';

const cx = classNamesBind.bind(styles);

const propTypes = {
  /**
   * Sites to display.
   */
  sites: sitesPropType.isRequired,

  /**
   * Function called to request closing the modal
   */
  onRequestClose: PropTypes.func.isRequired,
};

const ApplicationSwitcherModal = ({ onRequestClose, sites }) => (
  <ApplicationModal
    title="Application Switcher"
    onRequestClose={onRequestClose}
  >
    <List dividerStyle="bottom-only">
      {sites.map(site => (
        <Item key={site.url}>
          <Hyperlink className={cx('item')} href={site.url}>{site.title}</Hyperlink>
        </Item>
      ))}
    </List>
  </ApplicationModal>
);

ApplicationSwitcherModal.propTypes = propTypes;

export default ApplicationSwitcherModal;
