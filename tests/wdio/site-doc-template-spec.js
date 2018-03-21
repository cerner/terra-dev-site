/* global browser, Terra, before */
describe('SiteDocTemplate', () => {
  before(() => browser.setViewportSize(Terra.viewports('huge')[0]));

  describe('Default', () => {
    // Nathan - The terra-dev-site will create hidden 'raw' test urls to ensure the tests only caputure information on the
    // rendered component displays itself, not how the terra-dev-site displays it.
    beforeEach(() => browser.url('/#/raw/tests/dev-site/templates/default-doc-site-template'));

    //  I ran a sample run though, and using Terra.should.matchScreenshot() out of the box fails because of the size of the template, (it renders larger
    // than the terra-defined viewport height). This means we will probably want to capture sections of the template (think: examples section) for
    // these screenshot tests.
  });
});
