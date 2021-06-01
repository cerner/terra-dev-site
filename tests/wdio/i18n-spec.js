Terra.describeViewports('Locale', ['tiny'], () => {
  it('correctly sets the application locale', () => {
    browser.url('/single-page-test');
    const testLocale = browser.config.launcherOptions.locale || 'en';
    const actualLocale = $('html').getAttribute('lang');
    expect(actualLocale).toEqual(testLocale);
  });
});
