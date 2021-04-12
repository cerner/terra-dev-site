const path = require('path');
const generatePagesConfig = require('../../../../src/webpack/loaderUtils/generateNavigationConfig');

describe('generateNavigationConfig', () => {
  it('test standard config + additional content', () => {
    const addContextDependency = jest.fn();
    const config = generatePagesConfig({
      siteConfig: {
        additionalSearchDirectories: [],
        primaryNavigationItems: [{
          path: '/test',
          label: 'Test',
          contentExtension: 'ext',
          additionalContent: [
            {
              label: 'add',
              filePath: path.resolve(process.cwd(), 'tests', 'jest', 'webpack', 'loaderUtils', 'testContent', 'additionalContent.md'),
            },
          ],
        }, {
          path: '/findNothing',
          label: 'findNothing',
          contentExtension: 'findNothing',
        }],
        sourceFolder: 'tests/jest/webpack/loaderUtils/testContent',
        distributionFolder: '',
        enableDebugLogging: false,
        namespace: 'npm-package',
      },
      resolveExtensions: ['.js'],
      mode: 'development',
      contentDirectory: 'TestA',
      isLernaMonoRepo: false,
      addContextDependency,
      logger: () => {},
    });
    expect(addContextDependency).toHaveBeenCalledWith(`${path.resolve(process.cwd(), 'tests', 'jest', 'webpack', 'loaderUtils', 'testContent', 'TestA')}/`);
    expect(config.navigationConfig).toMatchSnapshot();
    expect(config.routesMap).toMatchSnapshot();
    expect(config.pageConfig).toMatchSnapshot();
    expect(config.contentImports).toEqual({
      '/test/npm-package/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/ext/file.ext.js'),
      '/test/npm-package/file-outside': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/fileOutside.ext.md'),
      '/test/npm-package/add': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/additionalContent.md'),
    });
  });

  it('tests prod mode', () => {
    const addContextDependency = jest.fn();
    const config = generatePagesConfig({
      siteConfig: {
        additionalSearchDirectories: [],
        primaryNavigationItems: [{
          path: '/test',
          label: 'Test',
          contentExtension: 'ext',
        }],
        distributionFolder: 'tests/jest/webpack/loaderUtils/testContent',
        sourceFolder: '',
        enableDebugLogging: false,
        namespace: 'npm-package',
      },
      resolveExtensions: ['.js'],
      mode: 'production',
      contentDirectory: 'TestA',
      isLernaMonoRepo: false,
      addContextDependency,
      logger: () => {},
    });
    expect(addContextDependency).not.toHaveBeenCalled();
    expect(config.navigationConfig).toMatchSnapshot();
    expect(config.routesMap).toMatchSnapshot();
    expect(config.pageConfig).toMatchSnapshot();
    expect(config.contentImports).toEqual({
      '/test/npm-package/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/ext/file.ext.js'),
      '/test/npm-package/file-outside': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/fileOutside.ext.md'),
    });
  });

  it('tests sorting', () => {
    const addContextDependency = jest.fn();
    const config = generatePagesConfig({
      siteConfig: {
        additionalSearchDirectories: [],
        primaryNavigationItems: [{
          path: '/test',
          label: 'Test',
          contentExtension: 'ext',
        }],
        distributionFolder: '',
        sourceFolder: 'tests/jest/webpack/loaderUtils/testContent',
        enableDebugLogging: false,
        namespace: 'npm-package',
      },
      resolveExtensions: ['.js'],
      mode: 'development',
      contentDirectory: 'TestB',
      isLernaMonoRepo: false,
      addContextDependency,
      logger: () => {},
    });
    expect(addContextDependency).toHaveBeenCalledWith(`${path.resolve(process.cwd(), 'tests', 'jest', 'webpack', 'loaderUtils', 'testContent', 'TestB')}/`);
    expect(config.navigationConfig).toMatchSnapshot();
    expect(config.routesMap).toMatchSnapshot();
    expect(config.pageConfig).toMatchSnapshot();
    expect(config.contentImports).toEqual({
      '/test/npm-package/a': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestB/ext/a.ext.js'),
      '/test/npm-package/b/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestB/ext/b/file.ext.js'),
      '/test/npm-package/dir/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestB/ext/dir.c/file.ext.js'),
      '/test/npm-package/first-file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestB/ext/firstFile.a.ext.js'),
      '/test/npm-package/second-file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestB/ext/secondFile.b.ext.js'),
    });
  });

  it('tests additionalSearchDirectories', () => {
    const addContextDependency = jest.fn();
    const config = generatePagesConfig({
      siteConfig: {
        additionalSearchDirectories: [
          path.resolve(process.cwd(), 'tests', 'jest', 'webpack', 'loaderUtils', 'testContent', 'TestA'),
        ],
        primaryNavigationItems: [{
          path: '/test',
          label: 'Test',
          contentExtension: 'ext',
        }],
        distributionFolder: '',
        sourceFolder: 'tests/jest/webpack/loaderUtils/testContent',
        enableDebugLogging: false,
        namespace: 'npm-package',
      },
      resolveExtensions: ['.js'],
      mode: 'development',
      contentDirectory: 'Empty',
      isLernaMonoRepo: false,
      addContextDependency,
      logger: () => {},
    });
    expect(addContextDependency).toHaveBeenCalledWith(`${path.resolve(process.cwd(), 'tests', 'jest', 'webpack', 'loaderUtils', 'testContent', 'Empty')}/`);
    expect(config.navigationConfig).toMatchSnapshot();
    expect(config.routesMap).toMatchSnapshot();
    expect(config.pageConfig).toMatchSnapshot();
    expect(config.contentImports).toEqual({
      '/test/npm-package/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/ext/file.ext.js'),
      '/test/npm-package/file-outside': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestA/fileOutside.ext.md'),
    });
  });

  it('tests multiple primary nav items', () => {
    const addContextDependency = jest.fn();
    const config = generatePagesConfig({
      siteConfig: {
        additionalSearchDirectories: [],
        primaryNavigationItems: [{
          path: '/test',
          label: 'Test',
          contentExtension: 'ext',
        }, {
          path: '/doc',
          label: 'Doc',
          contentExtension: 'doc',
        }],
        sourceFolder: 'tests/jest/webpack/loaderUtils/testContent',
        distributionFolder: '',
        enableDebugLogging: false,
        namespace: 'npm-package',
      },
      resolveExtensions: ['.js'],
      mode: 'development',
      contentDirectory: 'TestC',
      isLernaMonoRepo: false,
      addContextDependency,
      logger: () => {},
    });
    expect(addContextDependency).toHaveBeenCalledWith(`${path.resolve(process.cwd(), 'tests', 'jest', 'webpack', 'loaderUtils', 'testContent', 'TestC')}/`);
    expect(config.navigationConfig).toMatchSnapshot();
    expect(config.routesMap).toMatchSnapshot();
    expect(config.pageConfig).toMatchSnapshot();
    expect(config.contentImports).toEqual({
      '/test/npm-package/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestC/ext/file.ext.js'),
      '/doc/npm-package/file': path.join(process.cwd(), 'tests/jest/webpack/loaderUtils/testContent/TestC/doc/file.doc.js'),
    });
  });
});
