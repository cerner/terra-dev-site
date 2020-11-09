Terra.describeViewports('secondary nav', ['tiny', 'huge'], () => {
  it('checks accessibility', () => {
    browser.url('/secondary-nav-test');
    Terra.validates.element({ selector: '#root' });
  });
});
