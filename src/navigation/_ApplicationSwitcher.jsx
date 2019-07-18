import React from 'react';
import PropTypes from 'prop-types';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import List, { Item } from 'terra-list';
import Hyperlink from 'terra-hyperlink';
import { disclosureManagerShape, withDisclosureManager } from 'terra-application/lib/disclosure-manager';
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

  basename: PropTypes.string.isRequired,
  /**
   * Injected by disclosure manager
   */
  disclosureManager: disclosureManagerShape.isRequired,
};

/**
 * render a component to display apps available to switch to.
 * @param {*} props.disclosureManager disclosure manager object
 * @param {*} props.apps the apps to display
 */
const ApplicationSwitcher = ({ disclosureManager, apps, basename }) => (
  <ContentContainer
    header={(
      <ActionHeader title="Application Switcher" onBack={disclosureManager.goBack} onClose={disclosureManager.closeDisclosure} />
    )}
    fill
  >
    <List dividerStyle="bottom-only">
      {apps.map(app => (
        <Item key={app.path}>
          <Hyperlink className={cx('item')} href={`${basename}/${app.path}/`}>{app.title}</Hyperlink>
        </Item>
      ))}
    </List>
  </ContentContainer>
);

ApplicationSwitcher.propTypes = propTypes;

export default withDisclosureManager(ApplicationSwitcher);
