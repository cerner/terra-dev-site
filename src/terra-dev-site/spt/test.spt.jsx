import React from 'react';
import Markdown from 'terra-markdown';

const style = {
  height: '100%',
  overflow: 'auto',
  padding: '24px',
  position: 'relative',
};

const MarkdownExample = () => (
  <div style={style}>
    <Markdown src="Single Page Test" />
    <Markdown src={'```javascript\nconst thing = 1\n```'} />
  </div>
);

export default MarkdownExample;
