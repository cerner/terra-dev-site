Terra.describeViewports('loaders', ['huge'], () => {
  it('loads a js codeblock', () => {
    browser.url('/raw/test/cerner-terra-dev-site/loaders/codeblock-js');
    Terra.validates.element('js codeblock');
  });

  it('loads a json codeblock', () => {
    browser.url('/raw/test/cerner-terra-dev-site/loaders/codeblock-json');
    Terra.validates.element('json codeblock');
  });

  it('loads a ts codeblock', () => {
    browser.url('/raw/test/cerner-terra-dev-site/loaders/codeblock-ts');
    Terra.validates.element('ts codeblock');
  });

  it('loads a scss codeblock', () => {
    browser.url('/raw/test/cerner-terra-dev-site/loaders/codeblock-scss');
    Terra.validates.element('scss codeblock');
  });

  it('loads a package', () => {
    browser.url('/raw/test/cerner-terra-dev-site/loaders/package');
    Terra.validates.element('package');
  });

  it('loads a props table', () => {
    const windowSize = browser.getWindowSize();
    browser.setWindowSize(windowSize.width, 3000);
    browser.url('/raw/test/cerner-terra-dev-site/loaders/props-table');
    Terra.validates.element('props table');
  });

  it('loads an example', () => {
    const windowSize = browser.getWindowSize();
    browser.setWindowSize(windowSize.width, 3000);
    browser.url('/raw/test/cerner-terra-dev-site/loaders/example');
    Terra.validates.element('example');
  });

  it('Does not display css tab if there is no imported file', () => {
    Terra.validates.element('Hides css tab');
  });

  it('Reveals the examples code', () => {
    $('[class*=ExampleTemplate-module__code-toggle]').click();
    $('#root').moveTo({ xOffset: 0, yOffset: 0 });
    Terra.validates.element('Reveals the examples code');
  });

  it('Hides the examples code again', () => {
    $('[class*=ExampleTemplate-module__code-toggle]').click();
    $('#root').moveTo({ xOffset: 0, yOffset: 0 });
    Terra.validates.element('Hides the examples code again');
  });

  it('Reveals the examples css', () => {
    $('[class*=ExampleTemplate-module__css-toggle]').click();
    $('#root').moveTo({ xOffset: 0, yOffset: 0 });
    Terra.validates.element('Reveals the examples css');
  });

  it('Hides the examples css again', () => {
    $('[class*=ExampleTemplate-module__css-toggle]').click();
    $('#root').moveTo({ xOffset: 0, yOffset: 0 });
    Terra.validates.element('Hides the examples css again');
  });
});
