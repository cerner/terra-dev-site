import findCss from '../../../../../config/webpack/loaders/devSiteCssFinder';

describe('devSiteExample css finder', () => {
  it('should seperate a shortened css file path correctly', () => {
    const testText = 'Import from \'./pretendExampleCss.scss\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });

  it('should seperate a direct css file correctly', () => {
    const testText = 'Import from \'/Users/dm068655/Documents/ExternalR/terra-dev-site/tests/jest/config/webpack/loaders/pretendExampleCss.scss\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });

  it('should return undefined if there is no .css or .scss file declaration', () => {
    const testText = 'Import from \'./pretendExampleCss\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });

  it('should return undefined if there is not file declaration but the file name contains css', () => {
    const testText = 'Import from \'./pretendExampleCss\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });
});
