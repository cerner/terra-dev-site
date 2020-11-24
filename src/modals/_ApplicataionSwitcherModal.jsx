import React from 'react';
import PropTypes from 'prop-types';
import List, { Item } from 'terra-list';
import Hyperlink from 'terra-hyperlink';
import ApplicationModal from '@cerner/terra-application/lib/application-modal/ApplicationModal';

import { sitesShape } from '../site/siteConfigShapes';

const propTypes = {
  /**
   * Sites to display.
   */
  sites: sitesShape.isRequired,

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
    <List dividerStyle="bottom-only" paddingStyle="standard">
      {sites.map(site => (
        <Item key={site.url}>
          <Hyperlink data-app-switcher-link href={site.url}>{site.title}</Hyperlink>
        </Item>
      ))}
    </List>
  </ApplicationModal>
);

ApplicationSwitcherModal.propTypes = propTypes;

export default ApplicationSwitcherModal;
