import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved, import/extensions
import Markdown from 'terra-markdown';
import Button from 'terra-button';
import ReadMe from './navigation.config.md';
import SecondaryNavHeaderAdapter from '../../../../lib/navigation/_SecondaryNavHeaderAdapter';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import config from '!raw-loader!../../../../config/site/navigation.config';
// We're not using the doc template here to avoid circular dependencies.
const style = {
  height: '100%',
  overflow: 'auto',
  padding: '24px',
  position: 'relative',
};

const MarkdownExample = () => (
  <div style={style}>
    <SecondaryNavHeaderAdapter
      title="Navigation Config"
      content={(
        <Button text="Github" onClick={() => {
          window.open('https://github.com/cerner/terra-dev-site/blob/master/config/site/navigation.config.js', '_blank');
        }} />
      )}
    />
    <Markdown src={ReadMe} hasHeadingAnchors />
    <Markdown src={`\`\`\`javascript\n${config}\n\`\`\``} />
  </div>
);

export default MarkdownExample;
