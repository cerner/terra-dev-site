Terra.describeViewports('anchor tag', ['tiny', 'huge'], () => {
  it('Links to the anchor tag', () => {
    browser.url('/raw/test/cerner-terra-dev-site/anchor-tag#act-v');
    Terra.validates.element({ selector: '#root' });
  });
});
