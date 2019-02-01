import React from 'react';
import PropTypes from 'prop-types';
import Base from 'terra-base';
import ThemeProvider from 'terra-theme-provider';
import ModalManager from 'terra-modal-manager';
import { ActiveBreakpointProvider } from 'terra-breakpoints';

import './AppBase.scss';

const ApplicationBase = ({ locale, themeName, children }) => (
  <div style={{ height: '100%' }}>
    <Base className="base" locale={locale}>
      <ThemeProvider id="site" themeName={themeName} isGlobalTheme>
        <ActiveBreakpointProvider>
          <ModalManager>
            {children}
          </ModalManager>
        </ActiveBreakpointProvider>
      </ThemeProvider>
    </Base>
  </div>
);

ApplicationBase.propTypes = {
  locale: PropTypes.string,
  themeName: PropTypes.string,
  children: PropTypes.node,
};

export default ApplicationBase;
