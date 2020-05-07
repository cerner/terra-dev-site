Terra.describeViewports('secondary nav', ['tiny', 'huge'], () => {
  it('checks accessibility', () => {
    browser.url('/secondary-nav-test');
    Terra.validates.element({ selector: '#root' });
  });
});

Terra.describeViewports('secondary scroll multiple files', ['huge'], () => {
  it('should scroll to the correct file path based on navigation', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/multiple-files/example-2');
    Terra.validates.element({ selector: '#root' });
  });
});

Terra.describeViewports('secondary scroll multiple directories', ['huge'], () => {
  it('should find and scroll to the correct file in the directory structure', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/child-folder/example');
    Terra.validates.element({ selector: '#root' });
  });
});

Terra.describeViewports('secondary nav', ['huge'], () => {
  it('should not scroll when item is visible', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler/filler-test');
    Terra.validates.element('should not scroll when item is visible before', { selector: '#root' });
    browser.click('[class*="Extension-module__extension"]');
    browser.keys('Filler 04');
    browser.waitForVisible('[class*="list-item"]', 5000);
    browser.click('[class*="list-item"]');
    Terra.validates.element('should not scroll when item is visible after', { selector: '#root' });
  });

  it('should scroll up when item is not visible and at the top', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler-10/filler-10-test');
    Terra.validates.element('should scroll up when item is not visible and at the top before', { selector: '#root' });
    browser.click('[class*="Extension-module__extension"]');
    browser.keys('Filler 01');
    browser.waitForVisible('[class*="list-item"]', 5000);
    browser.click('[class*="list-item"]');
    Terra.validates.element('should scroll up when item is not visible and at the top after', { selector: '#root' });
  });

  it('should scroll down when item is not visible and at the bottom', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler/filler-test');
    Terra.validates.element('should scroll down when item is not visible and at the bottom before', { selector: '#root' });
    browser.click('[class*="Extension-module__extension"]');
    browser.keys('Filler 17');
    browser.waitForVisible('[class*="list-item"]', 5000);
    browser.click('[class*="list-item"]');
    Terra.validates.element('should scroll down when item is not visible and at the bottom after', { selector: '#root' });
  });
});
