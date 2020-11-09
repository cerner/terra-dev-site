Terra.describeViewports('utilities', ['huge'], () => {
  it('checks accessibility', () => {
    browser.url('/single-page-test');
    browser.click('[class*="UtilityMenuHeaderButton-module"]');
    Terra.validates.element({ selector: '#root' });
  });

  it('opens app switcher', () => {
    browser.click('[class*="PopupMenuListItem-module"]');
    Terra.validates.element('opens app switcher', { selector: '#root' });
  });

  it('selects an app', () => {
    browser.click('[class*="ApplicationSwitcherModal-module__item"]');
    Terra.validates.element('selects an app', { selector: '.terra-dev-site-extended' });
  });

  it('selects config', () => {
    browser.url('/single-page-test');
    browser.click('[class*="UtilityMenuHeaderButton-module"]');
    browser.click('[class*="PopupMenuListItem-module__item"]:nth-child(2)');
    Terra.validates.element('selects config', { selector: '#root' });
  });

  it('changes config', () => {
    browser.$('#terra-dev-site-locale-select').selectByIndex(1);

    browser.$('#terra-dev-site-direction-select').selectByIndex(2);
    Terra.validates.element('changes config', { selector: '#root' });

    browser.click('#submit');
    Terra.validates.element('config changed', { selector: '#root' });

    browser.click('[class*="UtilityMenuHeaderButton-module"]');
    browser.click('[class*="PopupMenuListItem-module__item"]:nth-child(2)');
    Terra.validates.element('confirms config', { selector: '#root' });
    browser.refresh();
  });
});

Terra.describeViewports('utilities', ['tiny'], () => {
  it('opens menu', () => {
    browser.url('/single-page-test');
    browser.click('[data-compact-header-toggle]');
    browser.waitForExist('[class*="ApplicationNavigation-module__drawer-menu-is-open"]');

    browser.pause(300);

    Terra.validates.element({ selector: '#root' });
  });

  it('opens app switcher', () => {
    browser.click('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]');
    browser.waitForVisible('[class*="ApplicationSwitcherModal-module__item"]');
    Terra.validates.element('opens app switcher', { selector: '#root' });
  });

  it('selects an app', () => {
    browser.click('[class*="ApplicationSwitcherModal-module__item"]');
    Terra.validates.element('selects an app', { selector: '.terra-dev-site-extended' });
  });

  it('selects config', () => {
    browser.url('/single-page-test');
    browser.click('[data-compact-header-toggle]');
    browser.click('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]:nth-child(2)');
    Terra.validates.element('selects config', { selector: '#root' });
  });

  it('changes config', () => {
    browser.$('#terra-dev-site-locale-select').selectByIndex(1);

    browser.$('#terra-dev-site-direction-select').selectByIndex(2);
    Terra.validates.element('changes config', { selector: '#root' });

    browser.click('#submit');
    Terra.validates.element('config changed', { selector: '#root' });

    browser.click('[data-compact-header-toggle]');
    browser.click('[class*="DrawerMenu-module__utility-item-list"] [class*="DrawerMenuListItem-module__item"]:nth-child(2)');
    Terra.validates.element('confirms config', { selector: '#root' });
    browser.refresh();
  });
});
