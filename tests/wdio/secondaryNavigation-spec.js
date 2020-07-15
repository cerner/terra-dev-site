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
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler-02/filler-02-test');
    Terra.validates.element('should not scroll when item is visible before', { selector: '#root' });
    browser.click('[class*="filler-02"]');
    browser.waitForVisible('[class*="filler-04"]', 5000);
    Terra.validates.element('should not scroll when item is visible after', { selector: '#root' });
  });

  it('should scroll up when item is not visible and at the top', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler-10/filler-10-test');
    Terra.validates.element('should scroll up when item is not visible and at the top before', { selector: '#root' });
    browser.click('[class*="filler-10"]');
    browser.waitForVisible('[class*="filler-01"]', 5000);
    Terra.validates.element('should scroll up when item is not visible and at the top after', { selector: '#root' });
  });

  it('should scroll down when item is not visible and at the bottom', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler/filler-test');
    Terra.validates.element('should scroll down when item is not visible and at the bottom before', { selector: '#root' });
    browser.click('[class*="filler-00"]');
    browser.waitForVisible('[class*="filler-17"]', 5000);
    Terra.validates.element('should scroll down when item is not visible and at the bottom after', { selector: '#root' });
  });

  it('should not scroll when selecting through spacebar', () => {
    browser.url('/secondary-nav-test/terra-dev-site/secondary-scroll-test/filler/filler-test');
    Terra.validates.element('should not scroll when selecting through spacebar before', { selector: '#root' });

    // Focus navigation menu so it can receive keyboard input
    browser.execute(() => {
      document.getElementById('terra-dev-site-nav-menu').focus();
    });
    browser.keys(['Down arrow', 'Space', 'Down arrow', 'Space']);
    Terra.validates.element('should not scroll when selecting through spacebar after', { selector: '#root' });
  });
});
