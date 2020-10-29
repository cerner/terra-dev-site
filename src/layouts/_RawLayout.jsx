import React from 'react';
import PropTypes from 'prop-types';
import { matchPath, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { HeadlessLayout } from '@cerner/terra-application/lib/layouts';
import { PromptRegistrationContext } from '@cerner/terra-application/lib/navigation-prompt';
import NotFoundPage from '../static-pages/_NotFoundPage';
import DevSitePage from '../pages/_DevSitePage';

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

const Raw = ({ siteConfig }) => {
  const location = useLocation();
  const nonRawPath = location.pathname.substring(4);

  return (
    <HeadlessLayout
      renderPage={() => (
        <PromptRegistrationContext.Provider value={promptProviderValue}>
          <DevSitePage pageContentConfig={siteConfig.pageConfig[nonRawPath]} contentImports={siteConfig.contentImports} />
        </PromptRegistrationContext.Provider>
      )}
    />
  );
};

Raw.propTypes = propTypes;

export default Raw;
