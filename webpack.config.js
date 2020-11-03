const path = require('path');
const merge = require('webpack-merge');
const fs = require('fs');
const defaultWebpackConfig = require('@cerner/webpack-config-terra');
const TerraDevSite = require('./webpack/plugin/TerraDevSite');
const TerraDevSiteEntrypoints = require('./webpack/plugin/TerraDevSiteEntrypoints');

const html = fs.readFileSync(require.resolve('./head.html'), 'utf8');

const devSiteConfig = () => ({
  entry: TerraDevSiteEntrypoints,
  plugins: [
    new TerraDevSite({
      primaryNavigationItems: [{
        path: '/home',
        text: 'Home',
        contentExtension: 'home',
        additionalContent: [
          {
            title: 'Home',
            filePath: path.resolve(process.cwd(), 'README.md'),
          },
        ],
      }, {
        path: '/dev_tools',
        text: 'Developer Tools',
        contentExtension: 'tool',
      }, {
        path: '/single-page-test',
        text: 'Single Page Test',
        contentExtension: 'spt',
      }, {
        path: '/secondary-nav-test',
        text: 'Secondary Nav Test',
        contentExtension: 'snt',
      }, {
        path: '/folder-first',
        text: 'Folder First Test',
        contentExtension: 'ff',
      }, {
        path: '/empty',
        text: 'Empty',
        contentExtension: 'empty',
      }, {
        path: '/components',
        text: 'Components',
        contentExtension: 'doc',
      }, {
        path: '/test',
        text: 'Test',
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
          modalPath: '@cerner/terra-dev-site/lib/test-extension/TestExtension',
        },
      ],
    }),
    new TerraDevSite({
      pathPrefix: 'derp',
      titleConfig: {
        title: 'Derp Site',
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
