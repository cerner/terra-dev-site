Terra.describeViewports('custom file extension', ['huge'], () => {
  it('checks accessibility on the raw route', () => {
    browser.url('/raw/test/cerner-terra-dev-site/file-extension-test');
    Terra.validates.element('accessibility on raw route');
  });
});
