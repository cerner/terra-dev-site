const path = require('path');
const applyDefaults = require('../../../../src/webpack/plugin/applyDefaults');

describe('applyDefault', () => {
  it('applies all defaults', () => {
    const config = applyDefaults();
    expect(config.primaryNavigationItems).toEqual([{
      path: '/home',
      label: 'Home',
      contentExtension: 'home',
      additionalContent: [
        {
          label: 'Home',
          filePath: path.resolve(process.cwd(), 'README.md'),
        },
      ],
    }, {
      path: '/application',
      label: 'Application',
      contentExtension: 'app',
    }, {
      path: '/components',
      label: 'Components',
      contentExtension: 'doc',
    }, {
      path: '/dev_tools',
      label: 'Developer Tools',
      contentExtension: 'tool',
    }, {
      path: '/guides',
      label: 'Guides',
      contentExtension: 'guide',
    }, {
      path: '/tests',
      label: 'Tests',
      contentExtension: 'test',
    }]);
    expect(config.additionalSearchDirectories).toEqual([]);
    expect(config.sideEffectImportFilePaths).toEqual([]);
    expect(config.titleConfig).toEqual({ title: 'Terra Dev Site' });
    expect(config.faviconFilePath).toEqual(path.join(__dirname, '..', '..', '..', '..', 'src', 'webpack', 'terra-favicon', '32px', 'favicon.ico'));
    expect(config.extensionItems).toEqual([]);
    expect(config.headHtml).toEqual([]);
    expect(config.sourceFolder).toEqual('src');
    expect(config.distributionFolder).toEqual('lib');
    expect(config.enableDebugLogging).toBeFalsy();
    expect(config.defaultLocale).toBeUndefined();
    expect(config.defaultTheme).toBeUndefined();
    expect(config.defaultDirection).toBeUndefined();
    expect(config.pathPrefix).toBeUndefined();
  });

  it('applies all defaults', () => {
    const config = applyDefaults({
      primaryNavigationItems: [{
        path: '/custom',
        label: 'Custom',
        contentExtension: 'custom',
      }],
      additionalSearchDirectories: [
        'dir',
      ],
      sideEffectImportFilePaths: [
        'sidEffect',
      ],
      titleConfig: {
        title: 'title',
      },
      defaultLocale: 'au',
      defaultTheme: 'dark',
      defaultDirection: 'rtl',
      faviconFilePath: 'path',
      extensionItems: [
        'item',
      ],
      headHtml: [
        'headHtml',
      ],
      pathPrefix: 'pathPrefix',
      sourceFolder: 'code',
      distributionFolder: 'dist',
      enableDebugLogging: true,
      derp: 'derp',
    });
    expect(config.primaryNavigationItems).toEqual([{
      path: '/custom',
      label: 'Custom',
      contentExtension: 'custom',
    }]);
    expect(config.additionalSearchDirectories).toEqual(['dir']);
    expect(config.sideEffectImportFilePaths).toEqual(['sidEffect']);
    expect(config.titleConfig).toEqual({ title: 'title' });
    expect(config.faviconFilePath).toEqual('path');
    expect(config.extensionItems).toEqual(['item']);
    expect(config.headHtml).toEqual(['headHtml']);
    expect(config.sourceFolder).toEqual('code');
    expect(config.distributionFolder).toEqual('dist');
    expect(config.enableDebugLogging).toBeTruthy();
    expect(config.defaultLocale).toEqual('au');
    expect(config.defaultTheme).toEqual('dark');
    expect(config.defaultDirection).toEqual('rtl');
    expect(config.pathPrefix).toEqual('pathPrefix');
    expect(config.derp).toBeUndefined();
  });
});
