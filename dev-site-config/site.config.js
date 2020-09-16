const fs = require('fs');
const navConfig = require('./navigation.config');

const html = fs.readFileSync(require.resolve('./head.html'), 'utf8');

const siteConfig = {
  navConfig,

  appConfig: {
    headHtml: [
      '<script> console.log("Inline head html script") </script>',
      html,
    ],

    extensions: [
      {
        iconPath: 'terra-icon/lib/icon/IconAllergy',
        key: 'terra-dev-site.test-extension',
        text: 'Test Extension',
        componentPath: '../src/test-extension/TestExtension',
        size: 'small',
      },
    ],
  },
};

module.exports = siteConfig;
