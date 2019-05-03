import React from 'react';

const SecondaryNavigationLayoutContext = React.createContext({
  default: 'value',
});

const withSecondaryNavigationLayout = (WrappedComponent) => {
  const WithSecondaryNavigationLayoutComp = props => (
    <SecondaryNavigationLayoutContext.Consumer>
      {secondaryNavigationLayout => <WrappedComponent {...props} secondaryNavigationLayout={secondaryNavigationLayout} />}
    </SecondaryNavigationLayoutContext.Consumer>
  );

  WithSecondaryNavigationLayoutComp.WrappedComponent = WrappedComponent;
  WithSecondaryNavigationLayoutComp.displayName = `withSecondaryNavigationLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithSecondaryNavigationLayoutComp;
};

export default SecondaryNavigationLayoutContext;
export {
  withSecondaryNavigationLayout,
};
