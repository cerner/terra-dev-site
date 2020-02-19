import React, { useState, useEffect } from 'react';
import ApplicationLoadingOverlay from 'terra-application/lib/application-loading-overlay';

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
  }, []);

  return <ApplicationLoadingOverlay isOpen={state.isOpen} />;
};

export default LoadingPage;
