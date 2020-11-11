const path = require('path');
const generatePagesConfig = require('../../../../src/webpack/loaderUtils/generateNavigationConfig');

describe('generateNavigationConfig', () => {
  it('applies all defaults', () => {
    const config = generatePagesConfig({
      siteConfig: {
        additionalSearchDirectories: [],
        primaryNavigationItems: [{
          path: '/test',
          text: 'Test',
          contentExtension: 'ext',
        }],
        sourceFolder: 'tests/jest/webpack/loaderUtils/testContent',
        distributionFolder: 'tests/jest/webpack/loaderUtils/testContent',
        enableDebugLogging: false,
        namespace: 'npm-package',
      },
      resolveExtensions: ['.js'],
      mode: 'development',
      contentDirectory: 'TestA',
      isLernaMonoRepo: false,
      addContextDependency: () => {},
      logger: () => {},
    });
    expect(config.navigationConfig).toMatchSnapshot();
    expect(config.routesMap).toMatchSnapshot();
    expect(config.pageConfig).toMatchSnapshot();
    expect(config.contentImports).toEqual({
      '/test/npm-package/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/ext/file.ext.js'),
      '/test/npm-package/file-outside': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/fileOutside.ext.md'),
    });
  });
});
