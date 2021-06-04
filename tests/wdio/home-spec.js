Terra.describeViewports('home', ['tiny', 'huge'], () => {
  it('checks accessibility', () => {
    browser.url('/');
    $('a [alt="devDependencies status"]').waitForDisplayed();
    $('a [alt="Dependencies status"]').waitForDisplayed();
    $('a [alt="Build Status"]').waitForDisplayed();
    $('a [alt="License"]').waitForDisplayed();
    $('a [alt="Cerner OSS"]').waitForDisplayed();
    $('a [alt="NPM version"]').waitForDisplayed();
    Terra.validates.accessibility({ selector: '#root' });
  });
});
