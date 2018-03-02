import MockComponent from './MockComponent';

const componentConfig = {
  'mock-component': {
    name: 'Mock Component',
    path: '/mock-component',
    component: MockComponent,
  },
  'mock-1': {
    name: 'Single Site Page',
    path: '/mock-1',
    pages: [
      {
        name: 'Index',
        path: '/index',
        component: MockComponent,
      },
    ],
  },
  'mock-2': {
    name: 'Multiple Site Pages',
    path: '/mock-2',
    pages: [
      {
        name: 'Index 1',
        path: '/index-1',
        component: MockComponent,
      },
      {
        name: 'Index 2',
        path: '/index-2',
        component: MockComponent,
      },
    ],
  },
  'mock-3': {
    name: 'Nested Site Pages',
    path: '/mock-3',
    pages: [
      {
        name: 'First Layer',
        path: '/first-layer',
        pages: [
          {
            name: 'Nested',
            path: '/nested',
            component: MockComponent,
          },
        ],
      },
    ],
  },
  'mock-4': {
    name: 'Site Page with Custom Placeholder',
    path: '/mock-4',
    // component: MockComponent,
    pages: [
      {
        name: 'Index 1',
        path: '/index-1',
        component: MockComponent,
      },
    ],
  },
  'mock-5': {
    name: 'Nested Site Page with Custom Placeholders',
    path: '/mock-5',
    pages: [
      {
        name: 'First Layer',
        path: '/first-layer',
        component: MockComponent,
        pages: [
          {
            name: 'Nested',
            path: '/nested',
            component: MockComponent,
          },
        ],
      },
    ],
  },
};

export default componentConfig;
