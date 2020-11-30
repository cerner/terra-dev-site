import React from 'react';
import ApplicationPage from '@cerner/terra-application/lib/page';
import { NavigationItemContext } from '@cerner/terra-application/lib/layouts';

import NotFoundOverlay from '../content/_NotFoundOverlay';

const NotFoundPage = () => {
  const { isActive } = React.useContext(NavigationItemContext);
  return (
    <ApplicationPage
      pageKey="Not Found Page"
      label="Page not found"
      preferHeaderIsHidden
    >
      { isActive && <NotFoundOverlay /> }
    </ApplicationPage>
  );
};

export default NotFoundPage;
