import React from 'react';
/**
 * Creates an app settings context to share global app setting with the dev toolbar.
 */
const AppSettingsContext = React.createContext({});

/**
 * Helper to add the app settings context as a prop to teh wrapped component.
 * @param {*} WrappedComponent
 */
const withAppSettings = (WrappedComponent) => {
  const withAppSettingsComp = props => (
    <AppSettingsContext.Consumer>
      {appSettings => <WrappedComponent {...props} appSettings={appSettings} />}
    </AppSettingsContext.Consumer>
  );

  withAppSettingsComp.WrappedComponent = WrappedComponent;

  return withAppSettingsComp;
};

export default AppSettingsContext;
export {
  withAppSettings,
};
