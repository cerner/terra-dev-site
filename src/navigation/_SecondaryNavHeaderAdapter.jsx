import React from 'react';

import SecondaryNavigationLayoutContext from './_SecondaryNavigationContext';

const SecondaryNavHeaderAdapter = ({ title, content }) => {
  const secondaryNavigationLayout = React.useContext(SecondaryNavigationLayoutContext);

  React.useEffect(() => {
    secondaryNavigationLayout.setHeaderContent({
      title,
      content,
    });

    return () => {
      secondaryNavigationLayout.setHeaderContent({
        title: undefined,
        content: undefined,
      });
    };
  }, [title, content]);

  return null;
};

export default SecondaryNavHeaderAdapter;
