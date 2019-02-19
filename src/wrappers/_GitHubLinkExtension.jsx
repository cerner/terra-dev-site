import React from 'react';
import PropTypes from 'prop-types';
import Image from 'terra-image';

const propTypes = {
  /**
   * The github url to navigate to when the link is clicked.
   */
  href: PropTypes.string,
};

const defaultProps = {
  href: undefined,
};

const GithubLinkExtension = (props) => {
  const { href } = props;
  return (
    <a href={href}>
      <Image
        variant="rounded"
        src="https://github.com/cerner/terra-dev-site/raw/master/src/app/components/github-logo.png"
        alt="github image"
        height="26px"
        width="26px"
        isFluid
      />
    </a>
  );
};

GithubLinkExtension.propTypes = propTypes;
GithubLinkExtension.defaultProps = defaultProps;

export default GithubLinkExtension;
