import React, { Suspense } from 'react';
import ApplicationPage from '@cerner/terra-application/lib/application-page/ApplicationPage';
import classNames from 'classnames/bind';
import IconTreemap from 'terra-icon/lib/icon/IconTreemap';
import IconLocationPin from 'terra-icon/lib/icon/IconLocationPin';

import PageErrorBoundary from './_DevSitePageErrorBoundary';
import LoadingPage from '../static-pages/_LoadingPage';
import ContentLoadedContainer from './_ContentLoaded';
import AppSettingsContext from '../navigation/_AppSettingsContext';
import ContentSettingsMenu from './_ContentSettingsMenu';
import styles from './DevSitePage.module.scss';

const cx = classNames.bind(styles);

const DevSiteContentPage = ({pageContentConfig, contentComponent: ContentComponent}) => {
  const localeButtonRef = React.useRef();
  const themeButtonRef = React.useRef();
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const [showLocale, setShowLocale] = React.useState(false);
  const appSettings = React.useContext(AppSettingsContext);
  const hasThemes = appSettings.themes && appSettings.themes.length > 1;
  const hasLocales = appSettings.locales && appSettings.locales.length > 1;

  const onChangeTheme = (theme) => {
    setShowThemeMenu(false);
    appSettings.onUpdate({ theme });
  };

  const onChangeLocale = (locale) => {
    setShowLocale(false);
    appSettings.onUpdate({ locale });
  };

  const pageActions = [];

  if (hasThemes) {
    pageActions.push({
      key: 'theme',
      text: 'Theme',
      icon: <IconTreemap />,
      onSelect: () => { setShowThemeMenu(true); },
      buttonRefCallback: (ref) => { themeButtonRef.current = ref; },
    });
  }

  if (hasLocales) {
    pageActions.push({
      key: 'locale',
      text: 'Locale',
      icon: <IconLocationPin />,
      onSelect: () => { setShowLocale(true); },
      buttonRefCallback: (ref) => { localeButtonRef.current = ref; },
    });
  }

  return (
    <ApplicationPage
      title={pageContentConfig.text}
      actions={pageActions}
    >
      <PageErrorBoundary>
        <Suspense fallback={(
          <LoadingPage />
        )}
        >
          <ContentLoadedContainer className={cx(...(pageContentConfig.type === 'md' || pageContentConfig.type === 'mdx' ? ['markdown'] : []))}>
            <ContentComponent />
          </ContentLoadedContainer>
        </Suspense>
      </PageErrorBoundary>
      { showLocale
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
      )}
    </ApplicationPage>
  );
};

export default DevSiteContentPage;
