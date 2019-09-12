Terra.describeViewports('terra-props-table-loader', ['huge'], () => {
  it('checks that terra-props-table-loader works', () => {
    browser.url('/raw/terra-props-table-loader/terra-dev-site/terra-props-table-loader');
    Terra.validates.element();
  });
});
