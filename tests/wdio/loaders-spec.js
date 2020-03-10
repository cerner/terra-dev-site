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

  it('loads a scss codeblock', () => {
    browser.url('/raw/test/terra-dev-site/loaders/codeblock-scss');
    Terra.validates.element('scss codeblock');
  });

  it('loads a package', () => {
    browser.url('/raw/test/terra-dev-site/loaders/package');
    Terra.validates.element('package');
  });

  it('loads a props table', () => {
    const viewport = browser.getViewportSize();
    viewport.height = 3000;
    browser.setViewportSize(viewport);
    browser.url('/raw/test/terra-dev-site/loaders/props-table');
    Terra.validates.element('props table');
  });

  it('loads an example', () => {
    const viewport = browser.getViewportSize();
    viewport.height = 3000;
    browser.setViewportSize(viewport);
    browser.url('/raw/test/terra-dev-site/loaders/example');
    Terra.validates.element('example');
  });

  it('Reveals the examples code', () => {
    browser.click('[class*=ExampleTemplate-module__code-toggle]');
    Terra.validates.element('Reveals the examples code');
  });

  it('Hides the examples code again', () => {
    browser.click('[class*=ExampleTemplate-module__code-toggle]');
    Terra.validates.element('Hides the examples code again');
  });
});
