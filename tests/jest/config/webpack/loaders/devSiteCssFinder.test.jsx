import findCss from '../../../../../config/webpack/loaders/devSiteCssFinder';

describe('devSiteExample css finder', () => {
  it('separates a shortened css file path correctly', () => {
    const testText = 'Import from \'./pretendExampleCss.scss\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });

  it('separates a direct css file correctly', () => {
    const testText = 'Import from \'/Users/dm068655/Documents/ExternalR/terra-dev-site/tests/jest/config/webpack/loaders/pretendExampleCss.scss\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });

  it('returns undefined if there is no .css or .scss file declaration', () => {
    const testText = 'Import from \'./pretendExample\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });

  it('returns undefined if there is not file declaration but the file name contains css', () => {
    const testText = 'Import from \'./pretendExampleCss\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });

  it('returns undefined when the import is commented out', () => {
    const testText = '// Import from \'./pretendExampleCss.css\'';
    const example = findCss(testText);
    expect(example).toMatchSnapshot();
  });
});
