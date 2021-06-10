Terra.describeViewports('utilities', ['huge'], () => {
  it('checks accessibility', () => {
    browser.url('/single-page-test');
    $('[class*="UtilityMenuHeaderButton-module"]').click();
    Terra.validates.element('accessibility', { selector: '#root' });
  });

  it('opens app switcher', () => {
    $('[class*="PopupMenuListItem-module"]').click();
    Terra.validates.element('opens app switcher', { selector: '#root' });
  });

  it('selects an app', () => {
    $('[class*="ApplicationSwitcher-module__item"]').click();
    Terra.validates.element('selects an app', { selector: '.terra-dev-site-extended' });
  });

  it('selects config', () => {
    browser.url('/single-page-test');
    $('[class*="UtilityMenuHeaderButton-module"]').click();
    $('[class*="PopupMenuListItem-module__item"]:nth-child(2)').click();
    Terra.validates.element('selects config', { selector: '#root' });
  });

  it('changes config', () => {
    $('#terra-dev-site-locale-select').click();
    $('#terra-select-option-en-AU').click();

    $('#terra-dev-site-theme-select').click();
    $('[id="terra-select-option-Terra Dev Site Test Theme"]').click();

    $('#terra-dev-site-direction-select').click();
    $('#terra-select-option-rtl').click();
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
    $('[class*="ApplicationNavigation-module__drawer-menu-is-open"]').waitForExist();

    browser.pause(300);

    Terra.validates.element('utility menu', { selector: '#root' });
  });

  it('opens app switcher', () => {
    $('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]').click();
    $('[class*="ApplicationSwitcher-module__item"]').waitForDisplayed();
    Terra.validates.element('opens app switcher', { selector: '#root' });
  });

  it('selects an app', () => {
    $('[class*="ApplicationSwitcher-module__item"]').click();
    Terra.validates.element('selects an app', { selector: '.terra-dev-site-extended' });
  });

  it('selects config', () => {
    browser.url('/single-page-test');
    $('[data-compact-header-toggle]').click();
    $('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]:nth-child(2)').click();
    // browser.waitForVisible('[class*="ApplicationSwitcher-module__item"]');
    Terra.validates.element('selects config', { selector: '#root' });
  });

  it('changes config', () => {
    $('#terra-dev-site-locale-select').click();
    $('#terra-select-option-en-AU').click();

    $('#terra-dev-site-theme-select').click();
    $('[id="terra-select-option-Terra Dev Site Test Theme"]').click();

    $('#terra-dev-site-direction-select').click();
    $('#terra-select-option-rtl').click();
    Terra.validates.element('changes config', { selector: '#root' });

    $('#submit').click();
    Terra.validates.element('config changed', { selector: '#root' });

    $('[data-compact-header-toggle]').click();
    $('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]:nth-child(2)').click();
    Terra.validates.element('confirms config', { selector: '#root' });
    browser.refresh();
  });
});
