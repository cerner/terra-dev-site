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

Terra.describeViewports('secondary nav scroll', ['huge'], () => {
  describe('should not scroll when item is visible', () => {
    before(() => browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler/filler-test'));
    Terra.it.validatesElement('Before', { selector: '#root' });
    it('selects filler 04 Test', () => {
      browser.click('[class*="Extension-module__extension"]');
      browser.keys('Filler 04');
      browser.waitForVisible('[class*="list-item"]');
      browser.click('[class*="list-item"]');
    });
    Terra.it.validatesElement('After', { selector: '#root' });
  });

  describe('should scroll up when item is not visible and at the top', () => {
    before(() => browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler-10/filler-10-test'));
    Terra.it.validatesElement('Before', { selector: '#root' });
    it('selects filler 01 Test', () => {
      browser.click('[class*="Extension-module__extension"]');
      browser.keys('Filler 01');
      browser.waitForVisible('[class*="list-item"]');
      browser.click('[class*="list-item"]');
    });
    Terra.it.validatesElement('After', { selector: '#root' });
  });

  describe('should scroll down when item is not visible and at the bottom', () => {
    before(() => browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler/filler-test'));
    Terra.it.validatesElement('Before', { selector: '#root' });
    it('selects filler Test', () => {
      browser.click('[class*="Extension-module__extension"]');
      browser.keys('Filler 17');
      browser.waitForVisible('[class*="list-item"]');
      browser.click('[class*="list-item"]');
    });
    Terra.it.validatesElement('After', { selector: '#root' });
  });
});
