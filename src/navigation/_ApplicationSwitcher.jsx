import React from 'react';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import List, { Item } from 'terra-list';
import Hyperlink from 'terra-hyperlink';
import { DisclosureManager } from 'terra-application';
import classNames from 'classnames/bind';
import styles from './ApplicationSwitcher.module.scss';

const cx = classNames.bind(styles);

const ApplicationSwitcher = ({ disclosureManager, apps}) => (
  <ContentContainer
    header={(
      <ActionHeader title="Application Switcher" onBack={disclosureManager.goBack} onClose={disclosureManager.closeDisclosure} />
    )}
    fill
  >
    <List>
      {apps.map((app) => {
        return (
          <Item key={app.path}>
            <Hyperlink className={cx('item')} href={`/${app.path}/`}>{app.title}</Hyperlink>
          </Item>
        );
      })}
    </List>
  </ContentContainer>
);

export default DisclosureManager.withDisclosureManager(ApplicationSwitcher);
