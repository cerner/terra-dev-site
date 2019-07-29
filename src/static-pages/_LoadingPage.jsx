import React, { useState, useEffect } from 'react';
import LoadingOverlay from 'terra-overlay/lib/LoadingOverlay';

// Wait half a second before showing the loading indicator.
const LoadingPage = () => {
  const [state, setState] = useState({ isOpen: false });

  useEffect(() => {
    let isActive = true;
    setTimeout(() => {
      if (isActive) {
        setState({ isOpen: true });
      }
    }, 500);
    return () => { isActive = false; };
  });

  return <LoadingOverlay message="" isOpen={state.isOpen} isAnimated isRelativeToContainer zIndex="6000" />;
};

export default LoadingPage;
