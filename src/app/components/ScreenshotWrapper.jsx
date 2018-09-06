import React from 'react';
import PropTypes from 'prop-types';
import Image from 'terra-image';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';

const propTypes = {
  imageConfig: PropTypes.arrayOf(PropTypes.shape({
    language: PropTypes.string,
    formFactor: PropTypes.string,
    contentPaths: PropTypes.shape({
      referenceImageSrc: PropTypes.string,
      latestImageSrc: PropTypes.string,
      diffImageSrc: PropTypes.string,
    }),
  })).isRequired,
};

const createImage = (config, index) => {
  let referenceComponent;
  let latestComponent;
  let diffComponent;

  if (config.contentPaths.referenceImageSrc) {
    referenceComponent = (
      <ContentContainer header={<ActionHeader title="Reference Image" />}>
        <Image src={config.contentPaths.referenceImageSrc} />
      </ContentContainer>
    );
  }
  if (config.contentPaths.latestImageSrc) {
    latestComponent = (
      <ContentContainer header={<ActionHeader title="Latest Image" />}>
        <Image src={config.contentPaths.latestImageSrc} />
      </ContentContainer>
    );
  }
  if (config.contentPaths.diffImageSrc) {
    diffComponent = (
      <ContentContainer header={<ActionHeader title="Diff Image" />}>
        <Image src={config.contentPaths.diffImageSrc} />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer header={<ActionHeader title={`Language-${config.language} FormFactor-${config.formFactor}`} key={`image-${index}`} />}>
      {referenceComponent}
      <br />
      {latestComponent}
      <br />
      {diffComponent}
    </ContentContainer>
  );
};

const ContentWrapper = ({ imageConfig }) => (
  <React.Fragment>
    {imageConfig.map((config, index) => createImage(config, index))}
  </React.Fragment>
);

ContentWrapper.propTypes = propTypes;

export default ContentWrapper;
