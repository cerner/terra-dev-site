jest.mock('html-webpack-plugin');
jest.mock('../../../../scripts/generate-app-config/generateAppConfig');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const generateAppConfig = require('../../../../scripts/generate-app-config/generateAppConfig');
const GeneratePlugin = require('../../../../config/webpack/plugin/GeneratePlugin');

describe('TerraDevSiteGeneratePlugin', () => {
  it('sets up member variables', () => {
    const plug = new GeneratePlugin({
      sites: [
        {
          siteConfig: {
            appConfig: {
              title: 'title',
              headline: 'headline',
              subline: 'subline',
              defaultLocale: 'defaultLocale',
            },
          },
          indexPath: '/path/index',
          prefix: 'prefix',
        },
        {
          siteConfig: {
            appConfig: {
              title: 'title',
              defaultLocale: 'defaultLocale2',
            },
          },
          indexPath: '/path/index2',
        },
      ],
      lang: 'lang',
      basename: 'basename',
    });
    expect(plug.entries).toEqual([
      'prefix/index',
      'index',
    ]);
    expect(plug.apps).toEqual([
      {
        path: 'prefix',
        url: 'basename/prefix',
        title: 'headline - title - subline',
      },
      {
        path: undefined,
        url: 'basename',
        title: 'title',
      },
    ]);
    expect(plug.sites).toEqual([
      {
        siteConfig: {
          appConfig: {
            title: 'title',
            headline: 'headline',
            subline: 'subline',
            defaultLocale: 'defaultLocale',
          },
        },
        indexPath: '/path/index',
        prefix: 'prefix',
        entry: 'prefix/index',
        filename: 'prefix/index.html',
        basename: 'basename/prefix',
        lang: 'lang',
      },
      {
        siteConfig: {
          appConfig: {
            title: 'title',
            defaultLocale: 'defaultLocale2',
          },
        },
        indexPath: '/path/index2',
        entry: 'index',
        filename: 'index.html',
        basename: 'basename',
        lang: 'lang',
      },
    ]);
  });

  it('sets up member variables without basename and lang', () => {
    const plug = new GeneratePlugin({
      sites: [
        {
          siteConfig: {
            appConfig: {
              title: 'title',
              headline: 'headline',
              subline: 'subline',
              defaultLocale: 'defaultLocale',
            },
          },
          indexPath: '/path/index',
          prefix: 'prefix',
        },
        {
          siteConfig: {
            appConfig: {
              title: 'title',
              defaultLocale: 'defaultLocale2',
            },
          },
          indexPath: '/path/index2',
        },
      ],
    });
    expect(plug.entries).toEqual([
      'prefix/index',
      'index',
    ]);
    expect(plug.apps).toEqual([
      {
        path: 'prefix',
        url: '/prefix',
        title: 'headline - title - subline',
      },
      {
        path: undefined,
        url: '/',
        title: 'title',
      },
    ]);
    expect(plug.sites).toEqual([
      {
        siteConfig: {
          appConfig: {
            title: 'title',
            headline: 'headline',
            subline: 'subline',
            defaultLocale: 'defaultLocale',
          },
        },
        indexPath: '/path/index',
        prefix: 'prefix',
        entry: 'prefix/index',
        filename: 'prefix/index.html',
        basename: '/prefix',
        lang: 'defaultLocale',
      },
      {
        siteConfig: {
          appConfig: {
            title: 'title',
            defaultLocale: 'defaultLocale2',
          },
        },
        indexPath: '/path/index2',
        entry: 'index',
        filename: 'index.html',
        basename: '',
        lang: 'defaultLocale2',
      },
    ]);
  });

  it('it applies the plugin', () => {
    const plug = new GeneratePlugin({
      sites: [
        {
          siteConfig: {
            appConfig: {
              title: 'title',
              headline: 'headline',
              subline: 'subline',
              defaultLocale: 'defaultLocale',
              defaultDirection: 'defaultDirection',
              favicon: 'favicon',
              headHtml: [],
            },
          },
          indexPath: '/path/index',
          prefix: 'prefix',
        },
        {
          siteConfig: {
            appConfig: {
              title: 'title',
              defaultLocale: 'defaultLocale2',
              defaultDirection: 'defaultDirection',
              favicon: 'favicon',
              headHtml: [],
            },
          },
          indexPath: '/path/index2',
        },
      ],
      lang: 'lang',
      basename: 'basename',
    });
    const compiler = {
      options: {
        mode: 'dev',
        entry: [],
      },
    };

    plug.apply(compiler);
    expect(generateAppConfig).toHaveBeenNthCalledWith(1, {
      siteConfig: {
        appConfig: {
          title: 'title',
          headline: 'headline',
          subline: 'subline',
          defaultLocale: 'defaultLocale',
          defaultDirection: 'defaultDirection',
          favicon: 'favicon',
          headHtml: [],
        },
      },
      mode: 'dev',
      prefix: 'prefix',
      apps: [{
        path: undefined,
        url: 'basename',
        title: 'title',
      }],
      basename: 'basename/prefix',
    });
    expect(generateAppConfig).toHaveBeenNthCalledWith(2, {
      siteConfig: {
        appConfig: {
          title: 'title',
          defaultLocale: 'defaultLocale2',
          defaultDirection: 'defaultDirection',
          favicon: 'favicon',
          headHtml: [],
        },
      },
      mode: 'dev',
      prefix: undefined,
      apps: [{
        path: 'prefix',
        url: 'basename/prefix',
        title: 'headline - title - subline',
      }],
      basename: 'basename',
    });
    expect(HtmlWebpackPlugin).toHaveBeenNthCalledWith(1, {
      title: 'title',
      filename: 'prefix/index.html',
      template: path.join(process.cwd(), 'lib', 'index.html'),
      lang: 'lang',
      rootElementId: 'root',
      dir: 'defaultDirection',
      favicon: 'favicon',
      headHtml: [''],
      headChunks: ['rewriteHistory'],
      excludeChunks: ['redirect', 'index'],
      inject: false,
    });
    expect(HtmlWebpackPlugin).toHaveBeenNthCalledWith(2, {
      title: 'title',
      filename: 'index.html',
      template: path.join(process.cwd(), 'lib', 'index.html'),
      lang: 'lang',
      rootElementId: 'root',
      dir: 'defaultDirection',
      favicon: 'favicon',
      headHtml: [''],
      headChunks: ['rewriteHistory'],
      excludeChunks: ['redirect', 'prefix/index'],
      inject: false,
    });
    expect(compiler.options.entry['prefix/index']).toEqual('/path/index');
    expect(compiler.options.entry.index).toEqual('/path/index2');
  });
});
