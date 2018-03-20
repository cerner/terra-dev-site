import React from 'react';

import SiteDocTemplate from '../SiteDocTemplate';
import readme from './TestReadme.md';
import TestComponentExample from './TestComponentExample';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import exampleSrc from '!raw-loader!./TestComponentExample.jsx';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import testComponentSrc from '!raw-loader!./TestComponent.jsx';

const Index = () => {
  const propsTables = [{ componentSource: testComponentSrc, componentName: 'Test Component' },
    { componentSource: testComponentSrc, componentName: 'Test Component (Again)' }];
  const exampleElement = <TestComponentExample />;
  const examples = [{ title: 'Test Example 1', description: 'Describing the test', example: exampleElement, source: exampleSrc },
    { title: 'Test Example 2', description: 'Describing the test mk. 2', example: exampleElement, source: exampleSrc }];

  return (<SiteDocTemplate version="1.9" readme={readme} propsTables={propsTables} examples={examples} />);
};

export default Index;
