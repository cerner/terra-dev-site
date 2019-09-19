Terra.describeViewports('terra-props-table-loader', ['huge'], () => {
  it('checks that terra-props-table-loader works', () => {
    const viewport = browser.getViewportSize();
    viewport.height = 2000;
    browser.setViewportSize(viewport);
    browser.url('/raw/test/terra-dev-site/terra-props-table-loader');
    Terra.validates.element();
  });
});
