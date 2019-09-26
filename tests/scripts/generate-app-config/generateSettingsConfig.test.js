const generateSettingsConfig = require('../../../scripts/generate-app-config/generateSettingsConfig');

describe('settings config', () => {
  it('returns undefined when app config is not supplied', () => {
    const config = generateSettingsConfig();
    expect(config).toEqual(undefined);
  });

  it('generates settings config with BiDi support', () => {
    const testAppConfig = {
      defaultTheme: 'Default Theme',
      themes: {
        'Default Theme': '',
      },
      bidirectional: true,
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

  it('generates settings config without BiDi support', () => {
    const testAppConfig = {
      defaultTheme: 'Default Theme',
      bidirectional: false,
      defaultDirection: 'rtl',
      defaultLocale: 'es',
    };

    const expectedSettingsConfig = {
      config: {
        defaultTheme: 'Default Theme',
        themes: {},
        directions: [],
        defaultDirection: 'rtl',
        locales: [],
        defaultLocale: 'es',
      },
    };

    const config = generateSettingsConfig(testAppConfig);
    expect(config).toEqual(expectedSettingsConfig);
  });
});
