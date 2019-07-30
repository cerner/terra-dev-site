Terra.describeViewports('raw route', ['tiny', 'huge'], () => {
  it('checks accessibility on the raw route', () => {
    browser.url('/raw/secondary-nav-test/terra-dev-site/themed');
    Terra.validates.element({ selector: '#root' });
  });

  it('checks that the # route redirects ', () => {
    browser.url('#/raw/secondary-nav-test/terra-dev-site/themed');
    Terra.validates.element('hash route', { selector: '#root' });
  });
});
