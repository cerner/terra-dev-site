import React, { Suspense } from 'react';
import Page, {
  PageActions,
  Action,
  CardLayout,
  Card,
} from '@cerner/terra-application/lib/page';
import { NavigationItemContext } from '@cerner/terra-application/lib/layouts';
import IconStartPresenting from 'terra-icon/lib/icon/IconStartPresenting';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';

import ContentErrorBoundary from '../content/_ContentErrorBoundary';
import LoadingOverlay from '../content/_LoadingOverlay';
import ContentLoadedContainer from '../content/_ContentLoaded';
import NotFoundPage from './_NotFoundPage';
import { contentImportsShape, pageContentConfigShape } from '../site/siteConfigShapes';

const propTypes = {
  /**
   * Config describing the page
   */
  pageContentConfig: pageContentConfigShape.isRequired,

  /**
   * Function called to request closing the modal
   */
  contentImports: contentImportsShape.isRequired,
};

const DevSitePage = ({ pageContentConfig, contentImports }) => {
  const location = useLocation();
  const history = useHistory();
  const isRaw = useRouteMatch('/raw');
  const isHome = useRouteMatch('/home');
  const { isActive } = React.useContext(NavigationItemContext);

  if (!isActive) {
    return null;
  }

  const pathname = isRaw ? location.pathname.substring(4) : location.pathname;
  const ContentComponent = contentImports[pathname];

  // Last Chance 404
  if (!ContentComponent) {
    return <NotFoundPage />;
  }

  const pageActions = (
    <PageActions>
      <Action
        actionKey="raw"
        label="Raw"
        icon={<IconStartPresenting />}
        onSelect={() => { history.push(`/raw${location.pathname}`); }}
      />
    </PageActions>
  );

  const props = {};

  if (isHome || isRaw) {
    props.preferHeaderIsHidden = true;
  } else {
    props.actions = pageActions;
  }

  return (
    <Page
      label={pageContentConfig.label}
      pageKey={pathname}
      {...props}
    >
      <ContentErrorBoundary>
        <Suspense fallback={(
          <LoadingOverlay />
        )}
        >
          <CardLayout>
            <Card minHeightFill>
              <ContentLoadedContainer type={pageContentConfig.type}>
                <ContentComponent />
              </ContentLoadedContainer>
            </Card>
          </CardLayout>
        </Suspense>
      </ContentErrorBoundary>
    </Page>
  );
};

DevSitePage.propTypes = propTypes;

export default DevSitePage;
