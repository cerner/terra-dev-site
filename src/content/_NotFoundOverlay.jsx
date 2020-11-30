import React from 'react';
import {
  useHistory,
} from 'react-router-dom';

import ApplicationStatusOverlay from '@cerner/terra-application/lib/application-status-overlay';

const NotFoundOverlay = () => {
  const history = useHistory();
  return (
    <ApplicationStatusOverlay
      message="Page not found."
      variant="error"
      buttonAttrs={[
        {
          key: 'go back',
          text: 'Go Back',
          onClick: () => { history.goBack(); },
        },
        {
          key: 'home',
          text: 'Home',
          onClick: () => { history.replace('/'); },
        },
      ]}
    />
  );
};

export default NotFoundOverlay;
