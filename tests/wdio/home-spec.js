Terra.describeViewports('home', ['tiny', 'huge'], () => {
  before(() => {
    const viewport = browser.getViewportSize();
    viewport.height = 2100;
    browser.setViewportSize(viewport);
  });

  it('checks accessibility', () => {
    browser.url('/');
    // browser.pause(1500);
    browser.waitForVisible('a [alt="devDependencies status"]');
    browser.waitForVisible('a [alt="Dependencies status"]');
    browser.waitForVisible('a [alt="Build Status"]');
    browser.waitForVisible('a [alt="License"]');
    browser.waitForVisible('a [alt="Cerner OSS"]');
    browser.waitForVisible('a [alt="NPM version"]');
    Terra.validates.accessibility({ selector: '#root' });
  });
});
