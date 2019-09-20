Terra.describeViewports('mdx', ['tiny', 'huge'], () => {
  it('validates blockquote syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/blockquote');
    Terra.validates.element();
  });

  it('validates css syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/css');
    Terra.validates.element();
  });

  it('validates diff syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/diff');
    Terra.validates.element();
  });

  it('validates html syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/html');
    Terra.validates.element();
  });

  it('validates invalid syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/invalid');
    Terra.validates.element();
  });

  it('validates javascript syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/javascript');
    Terra.validates.element();
  });

  it('validates jsx syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/jsx');
    Terra.validates.element();
  });

  it('validates noformat syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/noformat');
    Terra.validates.element();
  });

  it('validates scss syntax', () => {
    browser.url('/raw/test/terra-dev-site/syntax-highlighting/scss');
    Terra.validates.element();
  });

  it('renders MDX', () => {
    browser.url('/raw/test/terra-dev-site/mdx');
    Terra.validates.element();
  });

  it('renders md as mdx', () => {
    browser.url('/raw/test/terra-dev-site/mdx');
    Terra.validates.element();
  });

  it('styles md', () => {
    const viewport = browser.getViewportSize();
    viewport.height = 20000;
    browser.setViewportSize(viewport);
    browser.url('/raw/test/terra-dev-site/markdown-cheat-sheet');
    Terra.validates.element();
  });

  it('follows the link', () => {
    browser.url('/raw/test/terra-dev-site/relative-link');
    Terra.validates.element();
    browser.click('[class*="MarkdownTags-module__a"]');
    Terra.validates.element();
  });
});
