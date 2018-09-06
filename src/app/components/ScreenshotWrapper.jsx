import React from 'react';
import PropTypes from 'prop-types';
import Image from 'terra-image';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';

const propTypes = {
  imageConfig: PropTypes.arrayOf(PropTypes.shape({
    language: PropTypes.string.isRequired,
    viewport: PropTypes.string.isRequired,
    contentPath: PropTypes.string.isRequired,
  })).isRequired,
};

const createImage = (config, index) => (
  <ContentContainer header={<ActionHeader title={`Language: ${config.language}, Viewport: ${config.viewport}`} />} key={`image-${index}`}>
    <Image src={config.contentPath} />
  </ContentContainer>
);

const ScreenshotWrapper = ({ imageConfig }) => (
  <React.Fragment>
    {imageConfig.map((config, index) => createImage(config, index))}
  </React.Fragment>
);

ScreenshotWrapper.propTypes = propTypes;

export default ScreenshotWrapper;
