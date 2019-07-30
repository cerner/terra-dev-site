import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Image from 'terra-image';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import styles from './ScreenshotWrapper.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  imageConfig: PropTypes.arrayOf(PropTypes.shape({
    viewport: PropTypes.string.isRequired,
    contentPath: PropTypes.string.isRequired,
  })).isRequired,
};

const createImage = (config, index) => (
  <ContentContainer header={<ActionHeader title={`Viewport: ${config.viewport}`} />} key={`image-${index}`}>
    <Image src={config.contentPath} className={cx('image')} />
  </ContentContainer>
);

const ScreenshotWrapper = ({ imageConfig }) => (
  <React.Fragment>
    {imageConfig.map((config, index) => createImage(config, index))}
  </React.Fragment>
);

ScreenshotWrapper.propTypes = propTypes;

export default ScreenshotWrapper;
