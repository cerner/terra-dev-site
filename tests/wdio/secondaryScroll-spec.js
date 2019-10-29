Terra.describeViewports('secondary scroll multiple files', ['huge'], () => {
  it('should scroll to the correct file path based on navigation', () => {
    browser.url('/secondary-scroll/terra-dev-site/multiple-files/example-2');
    Terra.validates.element({ selector: '#root' });
  });
});

Terra.describeViewports('secondary scroll multiple directories', ['huge'], () => {
  it('should find and scroll to the correct file in the directory structure', () => {
    browser.url('secondary-scroll/terra-dev-site/parent-folder/child-folder/example');
    Terra.validates.element({ selector: '#root' });
  });
});
