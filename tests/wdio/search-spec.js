Terra.describeViewports('search', ['tiny', 'huge'], () => {
  it('checks accessibility', () => {
    browser.url('/single-page-test');
    $('[class*="Extension-module__extension"]').click();
    $('[class*="SearchField-module__input"]').waitForDisplayed();
    Terra.hideInputCaret('[class*="SearchField-module__input"]');
    Terra.validates.element('checks a11y', { selector: '#root' });
  });

  it('searches the site', () => {
    $('[class*="SearchField-module__input"]').click();
    browser.keys('v4.0.0');
    $('#-dev_tools-cerner-terra-dev-site-terra-dev-site-upgrade-guides-v-4-0-0').waitForDisplayed({ timeout: 5000 });
    Terra.validates.element('searches the site', { selector: '#root' });
  });

  it('selects an item', () => {
    $('#-dev_tools-cerner-terra-dev-site-terra-dev-site-upgrade-guides-v-4-0-0').click();
    $('#v400-upgrade-guide').waitForExist({ timeout: 20000 });
    Terra.validates.element('selects an item', { selector: '#root' });
  });
});
