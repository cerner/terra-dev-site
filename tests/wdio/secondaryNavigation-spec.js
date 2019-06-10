Terra.describeViewports('secondary nav', ['tiny', 'huge'], () => {
  it('checks accessibility', () => {
    browser.url('/single-page-test');
    Terra.validates.element({ selector: '#root' });
  });
});
