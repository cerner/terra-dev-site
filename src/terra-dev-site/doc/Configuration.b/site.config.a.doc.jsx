import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved, import/extensions
import Markdown from 'terra-markdown';
import ReadMe from './site.config.md';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import config from '!raw-loader!../../../../config/site/site.config';

// We're not using the doc template here to avoid circular dependencies.
const style = {
  height: '100%',
  overflow: 'auto',
  padding: '15px',
  position: 'relative',
};

const MarkdownExample = () => (
  <div style={style}>
    <Markdown src={ReadMe} />
    <Markdown src={`\`\`\`javascript\n${config}\n\`\`\``} />
  </div>
);

export default MarkdownExample;
