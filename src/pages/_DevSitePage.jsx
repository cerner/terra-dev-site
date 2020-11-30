import React from 'react';
import Page, {
  PageActions,
  Action,
  CardLayout,
  Card,
} from '@cerner/terra-application/lib/page';
import { NavigationItemContext } from '@cerner/terra-application/lib/layouts';
import IconStartPresenting from 'terra-icon/lib/icon/IconStartPresenting';
import { useLocation, useHistory } from 'react-router-dom';

import { contentImportsShape, pageContentConfigShape } from '../site/siteConfigShapes';
import DevSiteContent from '../content/_DevSiteContent';

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
  const { isActive } = React.useContext(NavigationItemContext);

  if (!isActive) {
    return null;
  }

  const { pathname } = location;
  const pageActions = (
    <PageActions>
      <Action
        actionKey="raw"
        label="Raw"
        icon={<IconStartPresenting />}
        onSelect={() => { history.push(`/raw${pathname}`); }}
      />
    </PageActions>
  );

  return (
    <Page
      label={pageContentConfig.label}
      pageKey={pathname}
      actions={pageActions}
    >
      <DevSiteContent
        pageContentConfig={pageContentConfig}
        contentImports={contentImports}
        ContentWrapper={({ children }) => (
          <CardLayout>
            <Card minHeightFill>
              {children}
            </Card>
          </CardLayout>
        )}
      />
    </Page>
  );
};

DevSitePage.propTypes = propTypes;

export default DevSitePage;
