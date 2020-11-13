import React, { Suspense } from 'react';
import Page, { PageActions, Action } from '@cerner/terra-application/lib/page';
import { NavigationItemContext } from '@cerner/terra-application/lib/layouts';
// import IconTreemap from 'terra-icon/lib/icon/IconTreemap';
// import IconLocationPin from 'terra-icon/lib/icon/IconLocationPin';
import IconStartPresenting from 'terra-icon/lib/icon/IconStartPresenting';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';

import PageErrorBoundary from './_DevSitePageErrorBoundary';
import LoadingOverlay from './_LoadingOverlay';
import ContentLoadedContainer from './_ContentLoaded';
// import AppSettingsContext from '../site/_AppSettingsContext';
// import ContentSettingsMenu from './_ContentSettingsMenu';
// import ComponentToolbar from './_ComponentToolbar';
import NotFoundPage from './_NotFoundPage';
import { contentImportsPropType, pageContentConfigPropType } from '../site/siteConfigPropTypes';

const propTypes = {
  /**
   * Config describing the page
   */
  pageContentConfig: pageContentConfigPropType.isRequired,

  /**
   * Function called to request closing the modal
   */
  contentImports: contentImportsPropType.isRequired,
};

const DevSitePage = ({ pageContentConfig, contentImports }) => {
  const location = useLocation();
  const history = useHistory();
  const isRaw = useRouteMatch('/raw');
  const isHome = useRouteMatch('/home');
  // const localeButtonRef = React.useRef();
  // const themeButtonRef = React.useRef();
  // const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  // const [showLocale, setShowLocale] = React.useState(false);
  // const appSettings = React.useContext(AppSettingsContext);
  const { isActive } = React.useContext(NavigationItemContext);

  if (!isActive) {
    return null;
  }

  const pathname = isRaw ? location.pathname.substring(4) : location.pathname;
  // const hasThemes = appSettings.themes && appSettings.themes.length > 1;
  // const hasLocales = appSettings.locales && appSettings.locales.length > 1;
  const ContentComponent = contentImports[pathname];

  // Last Chance 404
  if (!ContentComponent) {
    return <NotFoundPage />;
  }

  // const onChangeTheme = (theme) => {
  //   setShowThemeMenu(false);
  //   appSettings.onUpdate({ theme });
  // };

  // const onChangeLocale = (locale) => {
  //   setShowLocale(false);
  //   appSettings.onUpdate({ locale });
  // };

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

  // if (hasThemes) {
  //   pageActions.push({
  //     key: 'theme',
  //     label: 'Theme',
  //     icon: <IconTreemap />,
  //     onSelect: () => { setShowThemeMenu(true); },
  //     buttonRefCallback: (ref) => { themeButtonRef.current = ref; },
  //   });
  // }

  // if (hasLocales) {
  //   pageActions.push({
  //     key: 'locale',
  //     label: 'Locale',
  //     icon: <IconLocationPin />,
  //     onSelect: () => { setShowLocale(true); },
  //     buttonRefCallback: (ref) => { localeButtonRef.current = ref; },
  //   });
  // }

  const props = {};

  if (isHome || isRaw) {
    props.preferHeaderIsHidden = true;
  } else {
    props.actions = pageActions;
    // props.toolbar = <ComponentToolbar />;
  }

  return (
    <Page
      label={pageContentConfig.label}
      pageKey={pathname}
      {...props}
    >
      <PageErrorBoundary>
        <Suspense fallback={(
          <LoadingOverlay />
        )}
        >
          <ContentLoadedContainer type={pageContentConfig.type}>
            <ContentComponent />
          </ContentLoadedContainer>
        </Suspense>
      </PageErrorBoundary>
      {/* { showLocale
      && (
        <ContentSettingsMenu
          text="Locale"
          items={appSettings.locales}
          selectedKey={appSettings.currentLocale}
          onChange={onChangeLocale}
          targetRef={localeButtonRef.current}
          onRequestClose={() => setShowLocale(false)}
        />
      )}
      { showThemeMenu
      && (
        <ContentSettingsMenu
          text="Theme"
          items={appSettings.themes}
          selectedKey={appSettings.currentTheme}
          onChange={onChangeTheme}
          targetRef={themeButtonRef.current}
          onRequestClose={() => setShowThemeMenu(false)}
        />
      )} */}
    </Page>
  );
};

DevSitePage.propTypes = propTypes;

export default DevSitePage;
