import React from 'react';
import SiteDocTemplate from '../src/templates/SiteDocTemplate';
import { version } from '../package.json';
import readme from '../docs/SiteDocTemplate.md';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import SiteDocTemplateSrc from '!raw-loader!../src/templates/SiteDocTemplate.jsx';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import SelfSrc from '!raw-loader!./SiteDocTemplate.site-page.jsx';

const Index = () => (<SiteDocTemplate
  version={version}
  readme={readme}
  examples={[{ title: 'SiteDocTemplate', source: SelfSrc, example: (<p>This very page was generated using the SiteDocTemplate. The template supports more than one Props Table and example, even though those were not featured here.</p>) }]}
  propsTables={[{ componentName: 'SiteDocTemplate', componentSource: SiteDocTemplateSrc }]}
/>);

export default Index;
