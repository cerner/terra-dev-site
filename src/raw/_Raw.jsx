import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';
import classNames from 'classnames/bind';
import { PromptRegistrationContext } from 'terra-application/lib/navigation-prompt';
import NotFoundPage from '../static-pages/_NotFoundPage';

import styles from './Raw.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The path to the sites index.
   */
  contentConfig: PropTypes.shape({
    placeholder: PropTypes.node,
    content: PropTypes.shape({}),
    menuItems: PropTypes.shape({}),
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

const Raw = ({ indexPath, contentConfig, location }) => {
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

Raw.propTypes = propTypes;

export default withRouter(Raw);
