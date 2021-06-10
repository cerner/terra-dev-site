Terra.describeViewports('home', ['tiny', 'huge'], () => {
  it('checks accessibility', () => {
    browser.url('/single-page-test');
    Terra.validates.element('accessibility', { selector: '#root' });
  });
});
