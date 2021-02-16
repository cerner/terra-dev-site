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
    $('[class*="List-module__item"]', 5000).waitForDisplayed();
    Terra.validates.element('searches the site', { selector: '#root' });
  });

  it('selects an item', () => {
    $('[class*="List-module__item"]').click();
    // $('[class*="MarkdownTags-module"]', 5000).waitForDisplayed();
    Terra.validates.element('selects an item', { selector: '#root' });
  });
});
