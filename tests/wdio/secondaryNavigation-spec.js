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
