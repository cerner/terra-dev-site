/* global TERRA_DEV_SITE_BASENAME */
// TERRA_DEV_SITE_BASENAME is defined by webpack
import React from 'react';
import PropTypes from 'prop-types';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import List, { Item } from 'terra-list';
import Hyperlink from 'terra-hyperlink';
import { DisclosureManager } from 'terra-application';
import classNames from 'classnames/bind';
import styles from './ApplicationSwitcher.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Apps config
   */
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  /**
   * Injected by disclosure manager
   */
  disclosureManager: DisclosureManager.disclosureManagerShape.isRequired,
};

const ApplicationSwitcher = ({ disclosureManager, apps }) => (
  <ContentContainer
    header={(
      <ActionHeader title="Application Switcher" onBack={disclosureManager.goBack} onClose={disclosureManager.closeDisclosure} />
    )}
    fill
  >
    <List dividerStyle="bottom-only">
      {apps.map(app => (
        <Item key={app.path}>
          <Hyperlink className={cx('item')} href={`${TERRA_DEV_SITE_BASENAME}/${app.path}/`}>{app.title}</Hyperlink>
        </Item>
      ))}
    </List>
  </ContentContainer>
);

ApplicationSwitcher.propTypes = propTypes;

export default DisclosureManager.withDisclosureManager(ApplicationSwitcher);
