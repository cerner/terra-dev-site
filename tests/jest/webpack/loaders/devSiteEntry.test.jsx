jest.mock('../../../../src/webpack/loaderUtils/generateNavigationConfig');
const path = require('path');
const { runLoaders } = require('loader-runner');

const generateNavigatiionConfig = require('../../../../src/webpack/loaderUtils/generateNavigationConfig');

describe('devSiteEntry', () => {
  it('It fills out all the fields', (done) => {
    generateNavigatiionConfig.mockReturnValue({
      contentImports: {
        importNameA: 'filePathA',
        importNameB: 'filePathB',
      },
      pageConfig: {
        '/extended/cerner-terra-dev-site/extended': {
          label: 'Extended',
          type: 'jsx',
        },
      },
      routesMap: {
        '/': '/extended/cerner-terra-dev-site/extended',
        '/extended': '/extended/cerner-terra-dev-site/extended',
      },
      navigationConfig: [
        {
          label: 'Extended',
          path: '/extended',
          pageConfig: {
            label: 'Extended',
            path: '/extended/cerner-terra-dev-site/extended',
            type: 'jsx',
          },
        },
      ],
    });
    runLoaders({
      resource: path.resolve(process.cwd(), 'src', 'webpack', 'templates', 'entry.template'),
      loaders: [
        {
          loader: path.resolve(__dirname, '../../../../src/webpack/loaders/devSiteEntry'),
          options: {
            entryPath: 'entryPath',
            siteConfig: {
              extensionItems: [{
                key: 'extA',
                text: 'textA',
                iconPath: 'ExtensionIconPathA',
                modalFilePath: 'ExtensionModalPathA',
              }, {
                key: 'extB',
                text: 'textB',
                iconPath: 'ExtensionIconPathB',
                modalFilePath: 'ExtensionModalPathB',
              }],
              titleConfig: {
                title: 'title',
                headline: 'headline',
                subline: 'subline',
              },
              sideEffectImportFilePaths: [
                'sideEffectpathA',
                'sideEffectpathB',
              ],
              enableDebugLogging: true,
              defaultTheme: 'dark',
              defaultLocale: 'au',
              defaultDirection: 'rtl',
            },
            basename: 'basename',
            resolveExtensions: ['js'],
            sites: [{
              title: 'site',
              url: '/site',
            }],
            contentDirectory: 'content',
            isLernaMonoRepo: false,
          },
        },
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });

  it('It fills out the bare minimum', (done) => {
    generateNavigatiionConfig.mockReturnValue({
      contentImports: {
        importNameA: 'filePathA',
        importNameB: 'filePathB',
      },
      pageConfig: {
        '/extended/cerner-terra-dev-site/extended': {
          label: 'Extended',
          type: 'jsx',
        },
      },
      routesMap: {
        '/': '/extended/cerner-terra-dev-site/extended',
        '/extended': '/extended/cerner-terra-dev-site/extended',
      },
      navigationConfig: [
        {
          label: 'Extended',
          path: '/extended',
          pageConfig: {
            label: 'Extended',
            path: '/extended/cerner-terra-dev-site/extended',
            type: 'jsx',
          },
        },
      ],
    });
    runLoaders({
      resource: path.resolve(process.cwd(), 'src', 'webpack', 'templates', 'entry.template'),
      loaders: [
        {
          loader: path.resolve(__dirname, '../../../../src/webpack/loaders/devSiteEntry'),
          options: {
            entryPath: 'entryPath',
            siteConfig: {
              sideEffectImportFilePaths: [],
              extensionItems: [],
              titleConfig: {
                title: 'title',
              },
              enableDebugLogging: true,
            },
            basename: 'basename',
            resolveExtensions: ['js'],
            sites: [],
            contentDirectory: 'content',
            isLernaMonoRepo: false,
          },
        },
      ],
    }, (err, result) => {
      if (err) return done(err);
      expect(result.result[0]).toMatchSnapshot();
      return done();
    });
  });
});
