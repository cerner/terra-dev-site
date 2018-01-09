import React from 'react';
import PropTypes from 'prop-types';
import Image from 'terra-image';

const propTypes = {
  borderColor: PropTypes.string,
  height: PropTypes.string,
  src: PropTypes.string,
  textColor: PropTypes.string,
  width: PropTypes.string,
};

const defaultProps = {
  borderColor: 'lightgrey',
  height: '100%',
  src: undefined,
  textColor: 'grey',
  width: '100%',
};

const Placeholder = ({ borderColor, height, src, textColor, width }) => (
  <div style={{ height, width, position: 'relative', padding: '5px' }}>
    <div style={{ height: '100%', width: '100%', position: 'relative', border: `3px dashed ${borderColor}` }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', color: textColor, transform: 'translate3d(-50%, -50%, 0)' }}>
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
