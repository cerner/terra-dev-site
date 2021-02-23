Terra.describeViewports('search', ['tiny', 'huge'], () => {
  it('checks accessibility', () => {
    browser.url('/single-page-test');
    browser.click('[class*="Extension-module__extension"]');
    browser.waitForVisible('[class*="SearchField-module__input"]');
    Terra.hideInputCaret('[class*="SearchField-module__input"]');
    Terra.validates.element({ selector: '#root' });
  });

  it('searches the site', () => {
    browser.click('[class*="SearchField-module__input"]');
    browser.keys('v4.0.0');
    browser.waitForVisible('[class*="List-module__item"]', 5000);
    Terra.validates.element('searches the site', { selector: '#root' });
  });

  it('selects an item', () => {
    browser.click('[class*="List-module__item"]');
    browser.waitForVisible('[class*="MarkdownTags-module"]', 5000);
    Terra.validates.element('selects an item', { selector: '#root' });
  });
});
