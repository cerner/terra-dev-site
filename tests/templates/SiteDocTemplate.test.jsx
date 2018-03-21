import React from 'react';

import SiteDocTemplate from '../../src/templates/SiteDocTemplate';
import readme from '../../src/templates/examples/TestReadme.md';
import TestComponentExample from '../../src/templates/examples/TestComponentExample';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import exampleSrc from '../../src/templates/examples/TestComponentExample.jsx';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import testComponentSrc from '../../src/templates/examples/TestComponent.jsx';

jest.mock('../../src/templates/examples/TestReadme.md', ()=> 'test-file-stub');
jest.mock('../../src/templates/examples/TestComponentExample.jsx', ()=> 'test-file-stub');
jest.mock('../../src/templates/examples/TestComponent.jsx', ()=> 'test-file-stub');
const exampleElement = <TestComponentExample />;
// Snapshot Tests
it('should render a default component with nothing', () => {
  const wrapper = shallow(<SiteDocTemplate />);
  expect(wrapper).toMatchSnapshot();
});

it('should show the version', () => {
  const wrapper = shallow(<SiteDocTemplate version="1.9" />);
  expect(wrapper).toMatchSnapshot();
});

it('should show the readme', () => {
  const wrapper = shallow(<SiteDocTemplate readme={readme} />);
  expect(wrapper).toMatchSnapshot();
});

it('should show the version and readme', () => {
  const wrapper = shallow(<SiteDocTemplate version="1.9" readme={readme} />);
  expect(wrapper).toMatchSnapshot();
});

it('should show one example', () => {
  const wrapper = shallow(<SiteDocTemplate examples={[{ title: 'Test Example 1', description: 'Describing the test', example: exampleElement, source: exampleSrc }]} />);
  expect(wrapper).toMatchSnapshot();
});

it('should show multiple examples', () => {
  const wrapper = shallow(<SiteDocTemplate
    examples={[{ title: 'Test Example 1', description: 'Describing the test', example: exampleElement, source: exampleSrc },
      { title: 'Test Example 2', description: 'Describing the test mk. 2', example: exampleElement, source: exampleSrc }]}
  />);
  expect(wrapper).toMatchSnapshot();
});

it('should show one props table', () => {
  const wrapper = shallow(<SiteDocTemplate propsTables={[{ componentSource: testComponentSrc, componentName: 'Test Component' }]} />);
  expect(wrapper).toMatchSnapshot();
});

it('should show multiple props tables', () => {
  const wrapper = shallow(<SiteDocTemplate
    propsTables={[{ componentSource: testComponentSrc, componentName: 'Test Component' },
      { componentSource: testComponentSrc, componentName: 'Test Component (Again)' }]}
  />);
  expect(wrapper).toMatchSnapshot();
});

it('should show the version, readme, examples, and props tables', () => {
  const wrapper = shallow(<SiteDocTemplate
    version="1.9"
    readme={readme}
    examples={[{ title: 'Test Example 1', description: 'Describing the test', example: exampleElement, source: exampleSrc },
      { title: 'Test Example 2', description: 'Describing the test mk. 2', example: exampleElement, source: exampleSrc }]}
    propsTables={[{ componentSource: testComponentSrc, componentName: 'Test Component' },
      { componentSource: testComponentSrc, componentName: 'Test Component (Again)' }]}
  />);
  expect(wrapper).toMatchSnapshot();
});
