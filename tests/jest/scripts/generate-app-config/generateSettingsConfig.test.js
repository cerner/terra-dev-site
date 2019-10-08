const generateSettingsConfig = require('../../../../scripts/generate-app-config/generateSettingsConfig');

describe('settings config', () => {
  it('returns undefined when app config is not supplied', () => {
    const config = generateSettingsConfig();
    expect(config).toEqual(undefined);
  });

  it('generates settings with BiDi support by default', () => {
    const testAppConfig = {
      defaultTheme: 'Default Theme',
      themes: {
        'Default Theme': '',
      },
      defaultDirection: 'ltr',
      locales: ['en', 'es'],
      defaultLocale: 'en',
    };

    const expectedSettingsConfig = {
      config: {
        defaultTheme: 'Default Theme',
        themes: {
          'Default Theme': '',
        },
        directions: ['ltr', 'rtl'],
        defaultDirection: 'ltr',
        locales: ['en', 'es'],
        defaultLocale: 'en',
      },
    };

    const config = generateSettingsConfig(testAppConfig);
    expect(config).toEqual(expectedSettingsConfig);
  });
});
