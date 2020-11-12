const path = require('path');
const { merge } = require('webpack-merge');
const fs = require('fs');
const defaultWebpackConfig = require('@cerner/webpack-config-terra');
const TerraDevSite = require('./src/webpack/plugin/TerraDevSite');
const TerraDevSiteEntrypoints = require('./src/webpack/plugin/TerraDevSiteEntrypoints');

const html = fs.readFileSync(require.resolve('./head.html'), 'utf8');

const devSiteConfig = (env = {}) => ({
  entry: TerraDevSiteEntrypoints,
  plugins: [
    new TerraDevSite({
      enableDebugLogging: true,
      defaultLocale: env.defaultLocale,
      primaryNavigationItems: [{
        path: '/home',
        label: 'Home',
        contentExtension: 'home',
        additionalContent: [
          {
            title: 'Home',
            filePath: path.resolve(process.cwd(), 'README.md'),
          },
        ],
      }, {
        path: '/dev_tools',
        label: 'Developer Tools',
        contentExtension: 'tool',
      }, {
        path: '/single-page-test',
        label: 'Single Page Test',
        contentExtension: 'spt',
      }, {
        path: '/secondary-nav-test',
        label: 'Secondary Nav Test',
        contentExtension: 'snt',
      }, {
        path: '/folder-first',
        label: 'Folder First Test',
        contentExtension: 'ff',
      }, {
        path: '/empty',
        label: 'Empty',
        contentExtension: 'empty',
      }, {
        path: '/components',
        label: 'Components',
        contentExtension: 'doc',
      }, {
        path: '/test',
        label: 'Test',
        contentExtension: 'test',
      }],
      additionalSearchDirectories: [
        path.resolve(process.cwd(), 'node_modules', 'terra-list', 'lib', 'terra-dev-site'),
      ],
      headHtml: [
        '<script> console.log("Inline head html script") </script>',
        html,
      ],
      extensionItems: [
        {
          iconPath: 'terra-icon/lib/icon/IconAllergy',
          key: 'terra-dev-site.test-extension',
          text: 'Test Extension',
          modalFilePath: '@cerner/terra-dev-site/lib/test-extension/TestExtension',
        },
      ],
    }),
    new TerraDevSite({
      pathPrefix: 'extended',
      primaryNavigationItems: [{
        path: '/extended',
        label: 'Extended',
        contentExtension: 'extended',
      }],
      titleConfig: {
        title: 'Terra Dev Site - Extended',
      },
    }),
  ],
  resolve: {
    extensions: ['.jst'],
  },
});

const mergedConfig = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), devSiteConfig(env, argv))
);

const hackedConfig = (env = {}, argv = {}) => {
  const config = mergedConfig(env, argv);
  // Brittle
  config.module.rules[0].oneOf[0].test = /\.(jsx|js|jst)$/;

  return config;
};

module.exports = hackedConfig;
