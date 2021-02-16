Terra.describeViewports('utilities', ['huge'], () => {
  it('checks accessibility', () => {
    browser.url('/single-page-test');
    $('[class*="UtilityMenuHeaderButton-module"]').click();
    Terra.validates.element('checks a11y', { selector: '#root' });
  });

  it('opens app switcher', () => {
    $('[class*="PopupMenuListItem-module"]').click();
    Terra.validates.screenshot('opens app switcher', { selector: '#root' });
  });

  it('selects an app', () => {
    $('[data-app-switcher-link]').click();
    Terra.validates.element('selects an app', { selector: '.terra-dev-site-extended' });
  });

  it('selects config', () => {
    browser.url('/single-page-test');
    $('[class*="UtilityMenuHeaderButton-module"]').click();
    $('[class*="PopupMenuListItem-module__item"]:nth-child(2)').click();
    Terra.validates.element('selects config', { selector: '#root' });
  });

  it('changes config', () => {
    $('#terra-dev-site-locale-select').selectByIndex(1);

    $('#terra-dev-site-direction-select').selectByIndex(2);
    Terra.validates.element('changes config', { selector: '#root' });

    $('#submit').click();
    Terra.validates.element('config changed', { selector: '#root' });

    $('[class*="UtilityMenuHeaderButton-module"]').click();
    $('[class*="PopupMenuListItem-module__item"]:nth-child(2)').click();
    Terra.validates.element('confirms config', { selector: '#root' });
    browser.refresh();
  });
});

Terra.describeViewports('utilities', ['tiny'], () => {
  it('opens menu', () => {
    browser.url('/single-page-test');
    $('[data-compact-header-toggle]').click();
    $('[class*="ApplicationNavigation-module__drawer-menu-is-open"]').waitForDisplayed();

    browser.pause(300);

    Terra.validates.element('opens menu', { selector: '#root' });
  });

  it('opens app switcher', () => {
    $('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]').click();
    $('[data-app-switcher-link]').waitForDisplayed();
    Terra.validates.screenshot('opens app switcher', { selector: '#root' });
  });

  it('selects an app', () => {
    $('[data-app-switcher-link]').click();
    Terra.validates.element('selects an app', { selector: '.terra-dev-site-extended' });
  });

  it('selects config', () => {
    browser.url('/single-page-test');
    $('[data-compact-header-toggle]').click();
    $('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]:nth-child(2)').click();
    Terra.validates.element('selects config', { selector: '#root' });
  });

  it('changes config', () => {
    $('#terra-dev-site-locale-select').selectByIndex(1);

    $('#terra-dev-site-direction-select').selectByIndex(2);
    Terra.validates.element('changes config', { selector: '#root' });

    $('#submit').click();
    Terra.validates.element('config changed', { selector: '#root' });

    $('[data-compact-header-toggle]').click();
    $('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]:nth-child(2)').click();
    Terra.validates.element('confirms config', { selector: '#root' });
    browser.refresh();
  });
});
