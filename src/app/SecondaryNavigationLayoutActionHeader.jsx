import React from 'react';

import ButtonGroup from 'terra-button-group';
import IconLeft from 'terra-icon/lib/icon/IconLeft';
import IconLeftPane from 'terra-icon/lib/icon/IconLeftPane';

import { withSecondaryNavigationLayout } from './SecondaryNavigationLayout';

const SecondaryNavigationLayoutActionHeader = withSecondaryNavigationLayout(({
  secondaryNavigationLayout,
}) => {
  let button;
  if (secondaryNavigationLayout && secondaryNavigationLayout.openMenu) {
    button = (
      <ButtonGroup.Button
        icon={<IconLeft />}
        key="open-menu"
        text="Open Menu"
        onClick={secondaryNavigationLayout.openMenu}
      />
    );
  } else if (secondaryNavigationLayout && secondaryNavigationLayout.menuIsPinned) {
    button = (
      <ButtonGroup.Button
        icon={<IconLeftPane />}
        key="pin-menu"
        text="Pin Menu"
        onClick={secondaryNavigationLayout.unpinMenu}
      />
    );
  } else if (secondaryNavigationLayout) {
    button = (
      <ButtonGroup.Button
        icon={<IconLeftPane />}
        key="pin-menu"
        text="Unpin Menu"
        onClick={secondaryNavigationLayout.pinMenu}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.714rem',
        borderBottom: '1px solid lightgrey',
      }}
    >
      <ButtonGroup
        id="controlled-button-group"
        selectedKeys={secondaryNavigationLayout && secondaryNavigationLayout.menuIsPinned ? ['pin-menu'] : undefined}
      >
        {button}
      </ButtonGroup>
    </div>
  );
});

export default SecondaryNavigationLayoutActionHeader;
