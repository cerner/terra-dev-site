Terra.describeViewports('loaders', ['huge'], () => {
  it('loads a js codeblock', () => {
    browser.url('/raw/test/terra-dev-site/loaders/codeblock-js');
    Terra.validates.element('js codeblock');
  });

  it('loads a json codeblock', () => {
    browser.url('/raw/test/terra-dev-site/loaders/codeblock-json');
    Terra.validates.element('json codeblock');
  });

  it('loads a ts codeblock', () => {
    browser.url('/raw/test/terra-dev-site/loaders/codeblock-ts');
    Terra.validates.element('ts codeblock');
  });

  it('loads an example', () => {
    browser.url('/raw/test/terra-dev-site/loaders/example');
    Terra.validates.element('example');
  });

  it('loads a package', () => {
    browser.url('/raw/test/terra-dev-site/loaders/package');
    Terra.validates.element('package');
  });

  it('loads a props table', () => {
    const viewport = browser.getViewportSize();
    viewport.height = 2000;
    browser.setViewportSize(viewport);
    browser.url('/raw/test/terra-dev-site/loaders/props-table');
    Terra.validates.element('package');
  });
});
