Terra.describeViewports('home', ['tiny', 'huge'], () => {
  before(() => {
    const viewport = browser.getViewportSize();
    viewport.height = 2100;
    browser.setViewportSize(viewport);
  });

  it('checks accessibility', () => {
    browser.url('/');
    browser.pause(1500);
    Terra.validates.element({ selector: '#root' });
  });
});
