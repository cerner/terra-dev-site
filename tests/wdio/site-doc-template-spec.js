/* global browser, Terra, before */
describe('SiteDocTemplate', () => {
  before(() => browser.setViewportSize(Terra.viewports('huge')[0]));

  describe('Fully filled out doc', () => {
    beforeEach(() => browser.url('/#/raw/tests/dev-site/templates/default-doc-site-template'));

    Terra.should.matchScreenshot('Readme', { selector: '#SiteDocTemplateContainer > div > div:nth-child(2)' });
    Terra.should.matchScreenshot('Example 1', { selector: '#SiteDocTemplateContainer > div > div:nth-child(4)' });
    Terra.should.matchScreenshot('PropsTable 1', { selector: '#SiteDocTemplateContainer > div > div:nth-child(6)', viewports: [{ width: 1000, height: 1000 }] });
    Terra.should.beAccessible(Terra.viewports('huge'));
  });

  describe('Interactivity test', () => {
    beforeEach(() => browser.url('/#/raw/tests/dev-site/templates/default-doc-site-template'));

    it('Reveals the example\'s code', () => {
      const button = browser.element('[data-terra-example-hide]');
      button.click();

      browser.pause(1000);

      const screenshots = browser.checkElement('#SiteDocTemplateContainer > div > div:nth-child(4)', { viewports: Terra.viewports('huge') });
      expect(screenshots).to.matchReference();
    });

    it('Hides the example\'s code again', () => {
      let button = browser.element('[data-terra-example-hide]');
      button.click();

      button = browser.element('[data-terra-example-show]');
      button.click();

      const screenshots = browser.checkElement('#SiteDocTemplateContainer > div > div:nth-child(4)', { viewports: Terra.viewports('huge') });
      expect(screenshots).to.matchReference();
    });
  });
});
