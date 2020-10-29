import React from 'react';
import ApplicationPage from '@cerner/terra-application/lib/application-page/ApplicationPage';
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
      title="Not Found'"
    >
      { isActive
        && (
          <ApplicationStatusOverlay
            message="Page not found"
            variant="error"
            buttonAttrs={[
              {
                text: 'Go Back',
                onClick: () => { history.goBack(); },
              },
              {
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
