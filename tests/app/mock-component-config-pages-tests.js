import MockComponent from './MockComponent';

const componentConfig = {
  'mock-1': {
    name: 'Single Site & Test Page',
    path: '/mock-1',
    pages: [
      {
        name: 'Index',
        path: '/index',
        component: MockComponent,
      },
    ],
    tests: [
      {
        name: 'Index',
        path: '/index',
        component: MockComponent,
      },
    ],
  },
  'mock-2': {
    name: 'Single Site & Multiple Test Pages',
    path: '/mock-2',
    pages: [
      {
        name: 'Index',
        path: '/index',
        component: MockComponent,
      },
    ],
    tests: [
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
    name: 'Multiple Site & Single Test Pages',
    path: '/mock-3',
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
    tests: [
      {
        name: 'Index',
        path: '/index',
        component: MockComponent,
      },
    ],
  },
  'mock-4': {
    name: 'Multiple Site & Multple Test Pages',
    path: '/mock-4',
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
    tests: [
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
  'mock-5': {
    name: 'Nested Site & Test Pages',
    path: '/mock-5',
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
    tests: [
      {
        name: 'First Layer',
        path: '/first-layer',
        tests: [
          {
            name: 'Nested',
            path: '/nested',
            component: MockComponent,
          },
        ],
      },
    ],
  },
  'mock-6': {
    name: 'Site & Test Page with Custom Placeholder',
    path: '/mock-6',
    component: MockComponent,
    pages: [
      {
        name: 'Index 1',
        path: '/index-1',
        component: MockComponent,
      },
    ],
    tests: [
      {
        name: 'Index 1',
        path: '/index-1',
        component: MockComponent,
      },
    ],
  },
  'mock-7': {
    name: 'Nested Site & Test Page with Nested Custom Placeholders',
    path: '/mock-7',
    component: MockComponent,
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
    tests: [
      {
        name: 'First Layer',
        path: '/first-layer',
        component: MockComponent,
        tests: [
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
