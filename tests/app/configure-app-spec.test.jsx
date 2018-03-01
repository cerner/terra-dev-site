import configureApp from '../../src/app/configureApp';
import defaultSiteConfig from '../../src/config/site.config';
import MockComponent from './MockComponent';
import mockBasicCC from './mock-component-config';
import mockPagesCC from './mock-component-config-pages';
import mockTestsCC from './mock-component-config-tests';
import mockPagesTestsCC from './mock-component-config-pages-tests';

const rootPath = '/site';
const componentConfigs = {
  basic: mockBasicCC,
  pages: mockPagesCC,
  tests: mockTestsCC,
  'pages-and-tests': mockPagesTestsCC,
};

const testRoutesAndNavigation = (siteConfig, componentConfig, expectedRoutes, expectedNavigation) => {
  const { routeConfig, navigation } = configureApp(siteConfig, componentConfig);

  // assert the generated menu links
  expect(routeConfig).toHaveProperty(`menu.${rootPath}.component.tiny.props.links`, expectedNavigation.links);
  expect(routeConfig).toHaveProperty(`menu.${rootPath}.component.small.props.links`, expectedNavigation.links);

  // assert the generated menu content
  expect(Object.keys(routeConfig.content).length).toBe(expectedRoutes.length);
  expect(Object.keys(routeConfig.content)).toEqual(expect.arrayContaining((expectedRoutes)));

  // assert the generated navigation
  expect(navigation).toMatchObject(expectedNavigation);
};

const testMenuContent = (siteConfig, componentConfig, expectedContent) => {
  const { routeConfig } = configureApp(siteConfig, componentConfig);

  expect(Object.keys(routeConfig.menu).length).toBe(expectedContent.length);
  expect(Object.keys(routeConfig.menu)).toEqual(expect.arrayContaining((expectedContent)));
};

describe('configureApp', () => {
  const baseTestConfig = {
    readMeContent: 'Some read me content',
    placeholderSrc: undefined,
    navConfig: {
      rootPath,
      navigation: {},
    },
  };
  const siteConfig = Object.assign({}, defaultSiteConfig, baseTestConfig);

  afterEach(() => {
    siteConfig.navConfig.navigation = {};
  });

  it('handles an empty navigation object', () => {
    const expectedNavigation = {
      index: undefined, links: [], extensions: undefined,
    };
    testRoutesAndNavigation(siteConfig, mockBasicCC, [], expectedNavigation);
  });

  it('handles the navigation.index key', () => {
    siteConfig.navConfig.navigation = { index: '/site/mock' };
    const expectedNavigation = {
      index: '/site/mock', links: [], extensions: undefined,
    };
    testRoutesAndNavigation(siteConfig, mockBasicCC, [], expectedNavigation);
  });

  it('handles the navigation.extensions key', () => {
    siteConfig.navConfig.navigation = { extensions: MockComponent };
    const expectedNavigation = {
      index: undefined, links: [], extensions: MockComponent,
    };
    testRoutesAndNavigation(siteConfig, mockBasicCC, [], expectedNavigation);
  });

  describe('handles the navigation.links key', () => {
    let expectedRoutes = [];
    const expectedNavigation = {
      index: undefined,
      links: [],
      extensions: undefined,
    };

    it('does not create a link with only path', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
    });

    it('does not create a link with only a name', () => {
      siteConfig.navConfig.navigation.links = [{
        text: 'Mock',
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
    });

    it('does not create a link with only an exampleType', () => {
      siteConfig.navConfig.navigation.links = [{
        exampleType: 'mock',
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
    });

    it('does not create a link without an exampleType', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
    });

    describe('does not create a link without an name', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        exampleType: 'mock',
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
    });

    describe('does not create a link without an path', () => {
      siteConfig.navConfig.navigation.links = [{
        text: 'Mock',
        exampleType: 'mock',
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
    });

    Object.keys(componentConfigs).forEach((configKey) => {
      const componentConfig = componentConfigs[configKey];
      if (configKey !== 'pagesAndTests') {
        it(`creates a ${configKey} link with the default component`, () => {
          siteConfig.navConfig.navigation.links = [{
            path: '/site/mock',
            text: 'Mock',
            exampleType: configKey,
          }];

          if (configKey === 'tests') {
            expectedRoutes = ['/site/mock', '/raw/tests'];
            expectedNavigation.links = [];
          } else {
            expectedRoutes = ['/site/mock'];
            expectedNavigation.links = [{
              path: '/site/mock',
              text: 'Mock',
            }];
          }

          testRoutesAndNavigation(siteConfig, componentConfig, expectedRoutes, expectedNavigation);
        });

        it(`creates a ${configKey} link with a custom component`, () => {
          siteConfig.navConfig.navigation.links = [{
            path: '/site/mock',
            text: 'Mock',
            exampleType: configKey,
            component: MockComponent,
          }];

          testRoutesAndNavigation(siteConfig, componentConfig, expectedRoutes, expectedNavigation);
          // TEST THE CUSTOM COMPONENT
        });

        it(`creates a ${configKey} link with a sub nav indicator`, () => {
          siteConfig.navConfig.navigation.links = [{
            path: '/site/mock',
            text: 'Mock',
            exampleType: configKey,
            hasSubNav: true,
          }];

          if (configKey !== 'tests') {
            expectedNavigation.links = [{
              path: '/site/mock',
              text: 'Mock',
              hasSubNav: true,
            }];
          }

          testRoutesAndNavigation(siteConfig, componentConfig, expectedRoutes, expectedNavigation);
        });

        it('creates a link with a sub nav indicator and custom menu component', () => {
          siteConfig.navConfig.navigation.links = [{
            path: '/site/mock',
            text: 'Mock',
            exampleType: configKey,
            hasSubNav: true,
            menuComponent: MockComponent,
          }];

          testRoutesAndNavigation(siteConfig, componentConfig, expectedRoutes, expectedNavigation);
          // TEST THE CUSTOM COMPONENT
        });
      }
    });

    it('creates a home link with the default home component', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/home',
        text: 'Home',
        exampleType: 'home',
      }];
      expectedRoutes = ['/site/home'];
      expectedNavigation.links = [{
        path: '/site/home',
        text: 'Home',
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
      // TEST THE CUSTOM COMPONENT
    });

    it('creates a home link with the a custom home component', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/home',
        text: 'Home',
        exampleType: 'home',
        component: MockComponent,
      }];

      testRoutesAndNavigation(siteConfig, mockBasicCC, expectedRoutes, expectedNavigation);
      // TEST THE CUSTOM COMPONENT
    });

    it('creates multiple links', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        exampleType: 'pages',
        hasSubNav: true,
      },
      {
        path: '/tests',
        text: 'Mock Tests',
        exampleType: 'tests',
        hasSubNav: true,
      }];
      expectedRoutes = [
        '/site/mock',
        '/tests',
        '/raw/tests',
      ];
      expectedNavigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        hasSubNav: true,
      }];

      testRoutesAndNavigation(siteConfig, mockPagesTestsCC, expectedRoutes, expectedNavigation);
    });

    it('generates the expected menu content', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        exampleType: 'mock',
      }];
      const expectedMenuLinks = ['/site'];

      testMenuContent(siteConfig, mockBasicCC, expectedMenuLinks);
    });

    it('generates the expected menu content for a link with subnav', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/mock',
        text: 'Mock',
        exampleType: 'mock',
        hasSubNav: true,
      }];
      const expectedMenuLinks = [
        '/site/mock',
        '/site',
      ];

      testMenuContent(siteConfig, mockBasicCC, expectedMenuLinks);
    });

    it('only generates the menu routes for components with multiple pages or nested config', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/pages',
        text: 'Mock',
        exampleType: 'pages',
        hasSubNav: true,
      }];
      const expectedMenuLinks = [
        '/site/pages',
        '/site/pages/mock-2',
        '/site/pages/mock-3/first-layer',
        '/site/pages/mock-3',
        '/site/pages/mock-5/first-layer',
        '/site/pages/mock-5',
        '/site',
      ];

      testMenuContent(siteConfig, mockPagesCC, expectedMenuLinks);
    });

    it('generates the menu links for all possible test routes', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/tests',
        text: 'Mock',
        exampleType: 'tests',
        hasSubNav: true,
      }];
      const expectedMenuLinks = [
        '/tests/mock-1',
        '/tests/mock-2',
        '/tests/mock-3/first-layer',
        '/tests/mock-3',
        '/tests/mock-4',
        '/tests/mock-5/first-layer',
        '/tests/mock-5',
        '/tests',
        '/site',
      ];

      testMenuContent(siteConfig, mockTestsCC, expectedMenuLinks);
    });

    it('generates menu links for all possible test routes', () => {
      siteConfig.navConfig.navigation.links = [{
        path: '/site/pages',
        text: 'Mock',
        exampleType: 'pages',
        hasSubNav: true,
      }, {
        path: '/tests',
        text: 'Mock',
        exampleType: 'tests',
        hasSubNav: true,
      }];
      const expectedMenuLinks = [
        '/tests/mock-1',
        '/tests/mock-2',
        '/tests/mock-3',
        '/tests/mock-4',
        '/tests/mock-5/first-layer',
        '/tests/mock-5',
        '/tests/mock-6',
        '/tests/mock-7/first-layer',
        '/tests/mock-7',
        '/tests',
        '/site/pages',
        '/site/pages/mock-3',
        '/site/pages/mock-4',
        '/site/pages/mock-5/first-layer',
        '/site/pages/mock-5',
        '/site/pages/mock-7/first-layer',
        '/site/pages/mock-7',
        '/site',
      ];

      testMenuContent(siteConfig, mockPagesTestsCC, expectedMenuLinks);
    });
  });
});
