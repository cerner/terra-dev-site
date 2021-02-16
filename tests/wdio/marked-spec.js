Terra.describeViewports('md', ['huge'], () => {
  it('renders md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md');
    $('#root').moveTo({ xOffset: 0, yOffset: 768 });
    Terra.validates.element('md');
  });

  it('validates css syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/css');
    Terra.validates.element('css syntax');
  });

  it('validates diff syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/diff');
    Terra.validates.element('diff syntax');
  });

  it('validates html syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/html');
    Terra.validates.element('html syntax');
  });

  it('validates invalid syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/invalid');
    Terra.validates.element('invalid syntax');
  });

  it('validates javascript syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/javascript');
    Terra.validates.element('javascript syntax');
  });

  it('validates jsx syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/jsx');
    Terra.validates.element('js syntax');
  });

  it('validates noformat syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/noformat');
    Terra.validates.element('noformat syntax');
  });

  it('validates inline syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/inline');
    Terra.validates.element('inline syntax');
  });

  it('validates blockquotes md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/blockquotes');
    Terra.validates.element('md blockquotes');
  });

  it('validates Emphasis md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/emphasis');
    Terra.validates.element('md emphasis');
  });

  it('validates Headers md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/headers');
    Terra.validates.element('md headers');
  });

  it('validates Horizontal Rule md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/horizontal-rule');
    Terra.validates.element('md horizontal rule');
  });

  it('validates Images md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/images');
    browser.pause(3000);// to display image
    Terra.validates.element('md images');
  });

  it('validates Inline Html md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/inline-html');
    Terra.validates.element('md inline html');
  });

  it('validates Line Breaks md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/line-breaks');
    Terra.validates.element('md line breaks');
  });

  it('validates Links md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/links');
    Terra.validates.element('md links');
  });

  it('validates Lists md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/lists');
    Terra.validates.element('md lists');
  });

  it('validates Tables md', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-markdown/tables');
    Terra.validates.element('md tables');
  });

  it('validates scss syntax', () => {
    browser.url('/raw/test/cerner-terra-dev-site/md-syntax-highlighting/scss');
    Terra.validates.element('scss syntax');
  });
});
