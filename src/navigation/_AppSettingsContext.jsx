import React from 'react';

const AppSettingsContext = React.createContext({});

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
