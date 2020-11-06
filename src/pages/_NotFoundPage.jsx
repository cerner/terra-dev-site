import React from 'react';
import ApplicationPage from '@cerner/terra-application/lib/page';
import { NavigationItemContext } from '@cerner/terra-application/lib/layouts';
import {
  useHistory,
} from 'react-router-dom';

import ApplicationStatusOverlay from '@cerner/terra-application/lib/application-status-overlay';

const DevSiteContentPage = () => {
  const { isActive } = React.useContext(NavigationItemContext);
  const history = useHistory();
  return (
    <ApplicationPage
      title="Not Found"
      preferHeaderIsHidden
    >
      { isActive
        && (
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
        )}
    </ApplicationPage>
  );
};

export default DevSiteContentPage;
