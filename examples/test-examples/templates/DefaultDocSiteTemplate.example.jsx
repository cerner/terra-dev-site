// ADD your test examples in this directory. When naming examples add with test-name.example.jsx
import React from 'react';

import SiteDocTemplate from '../../../src/templates/SiteDocTemplate';
import readme from '../../../src/templates/examples/TestReadme.md';
// eslint-disable-next-line import/no-duplicates
import TestComponentExample from '../../../src/templates/examples/TestComponentExample';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions, import/no-duplicates
import exampleSrc from '!raw-loader!../../../src/templates/examples/TestComponentExample.jsx';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import testComponentSrc from '!raw-loader!../../../src/templates/examples//TestComponent.jsx';

const Index = () => {
  const propsTables = [{ componentSource: testComponentSrc, componentName: 'Test Component' },
    { componentSource: testComponentSrc, componentName: 'Test Component (Again)' }];
  const exampleElement = <TestComponentExample />;
  const examples = [{ title: 'Test Example 1', description: 'Describing the test', example: exampleElement, source: exampleSrc },
    { title: 'Test Example 2', description: 'Describing the test mk. 2', example: exampleElement, source: exampleSrc }];

  return (<SiteDocTemplate version="1.9" readme={readme} propsTables={propsTables} examples={examples} />);
};

export default Index;
