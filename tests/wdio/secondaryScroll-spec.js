Terra.describeViewports('secondary scroll', ['tiny', 'huge'], () => {
  it('should scroll to the correct file path based on navigation', () => {
    browser.url('/secondary-scroll/terra-dev-site/multiple-files/themed');
    Terra.validates.element({ selector: '#root' });
  });

  // it('should find and scroll to the correct file in the directory structure', () => {
  //   browser.url('secondary-scroll/terra-dev-site/parent-folder/child-folder/placeholder-page');
  //   Terra.validates.element({ selector: '#root' });
  // });
});
