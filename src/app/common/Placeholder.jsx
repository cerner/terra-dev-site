import React from 'react';
import PropTypes from 'prop-types';
import Image from 'terra-image';

const propTypes = {
  /**
   * The image source to display.
   */
  src: PropTypes.string,
};

const defaultProps = {
  src: undefined,
};

const Placeholder = ({ src }) => (
  <div style={{ height: '100%', width: '100%', position: 'relative', padding: '5px' }}>
    <div style={{ height: '100%', width: '100%', position: 'relative', border: '3px dashed', borderColor: 'lightgrey' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', color: 'grey', transform: 'translate3d(-50%, -50%, 0)' }}>
        <h3>
          {!!src && <Image variant="rounded" src={src} height="160px" width="160px" isFluid style={{ opacity: '.2' }} />}
        </h3>
      </div>
    </div>
  </div>
);

Placeholder.propTypes = propTypes;
Placeholder.defaultProps = defaultProps;

export default Placeholder;
