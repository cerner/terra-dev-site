Terra.describeViewports('Locale', ['tiny'], () => {
  it('correctly sets the application locale', () => {
    browser.url('/single-page-test');
    const testLocale = browser.options.locale || 'en';
    const actualLocale = browser.getAttribute('html', 'lang');
    expect(actualLocale).to.equal(testLocale);
  });
});
