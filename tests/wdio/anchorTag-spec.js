Terra.describeViewports('anchor tag', ['tiny', 'huge'], () => {
  it('Links to the anchor tag', () => {
    browser.url('/raw/test/terra-dev-site/anchor-tag#act-v');
    Terra.validates.element('anchor tag', { selector: '#root' });
  });
});
