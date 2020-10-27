import React from 'react';
import PropTypes from 'prop-types';
import { matchPath, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { HeadlessLayout } from '@cerner/terra-application/lib/layouts';
import { PromptRegistrationContext } from '@cerner/terra-application/lib/navigation-prompt';
import ApplicationPage from '@cerner/terra-application/lib/application-page/ApplicationPage';
import NotFoundPage from '../static-pages/_NotFoundPage';
import DevSitePage from '../pages/_DevSitePage';

import styles from './Raw.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The path to the sites index.
   */
  contentConfig: PropTypes.shape({
    placeholder: PropTypes.node,
    content: PropTypes.object,
    menuItems: PropTypes.object,
  }).isRequired,
  /**
   * The path to the sites index.
   */
  indexPath: PropTypes.string.isRequired,
  /**
   * Injected by react-router: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

const promptProviderValue = {
  registerPrompt: () => { },
  unregisterPrompt: () => { },
};

const RawOld = ({ indexPath, contentConfig, location }) => {
  const flattenedRouteConfig = Object.keys(contentConfig).reduce((allRoutes, pageKey) => Object.assign(allRoutes, contentConfig[pageKey]), {});

  const routes = Object.keys(flattenedRouteConfig).sort().reverse();
  const nonRawPath = location.pathname.substring(4);

  const route = routes.find(routeToMatch => matchPath(nonRawPath, routeToMatch));

  if (route) {
    const { componentClass: ComponentClass, props } = flattenedRouteConfig[route].component.default;
    return (
      <main className={cx('main')} role="main">
        {/* The following context provider will prevent the navigation prompt from registering any new prompts through raw routes.  */}
        <PromptRegistrationContext.Provider value={promptProviderValue}>
          <ComponentClass {...props} />
        </PromptRegistrationContext.Provider>
      </main>
    );
  }

  return <NotFoundPage homePath={indexPath} />;
};

const Raw = ({ siteConfig }) => {
  const location = useLocation();
  const nonRawPath = location.pathname.substring(4);

  return (
    <HeadlessLayout
      renderPage={() => (
        <DevSitePage pageContentConfig={siteConfig.pageConfig[nonRawPath]} contentImports={siteConfig.contentImports} />
      )}
    />
  );
};

Raw.propTypes = propTypes;

export default Raw;
