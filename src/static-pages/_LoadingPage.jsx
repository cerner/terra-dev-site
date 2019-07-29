import React, { useState } from 'react';
import LoadingOverlay from 'terra-overlay/lib/LoadingOverlay';

// Wait half a second before showing the loading indicator.
const LoadingPage = () => {
  const [state, setState] = useState({ isOpen: false });
  setTimeout(() => setState({ isOpen: true }), 500);
  return <LoadingOverlay message="" isOpen={state.isOpen} isAnimated isRelativeToContainer zIndex="6000" />;
};

export default LoadingPage;
