Terra.describeViewports('mdx', ['tiny', 'huge'], () => {
  it('loads a js codeblock', () => {
    browser.url('/raw/test/terra-dev-site/loaders/codeblock-js');
    Terra.validates.element();
  });

  it('loads a json codeblock', () => {
    browser.url('/raw/test/terra-dev-site/loaders/codeblock-json');
    Terra.validates.element();
  });

  it('loads a ts codeblock', () => {
    browser.url('/raw/test/terra-dev-site/loaders/codeblock-ts');
    Terra.validates.element();
  });

  it('loads an example', () => {
    browser.url('/raw/test/terra-dev-site/loaders/example');
    Terra.validates.element();
  });

  it('loads a package', () => {
    browser.url('/raw/test/terra-dev-site/loaders/package');
    Terra.validates.element();
  });
});
