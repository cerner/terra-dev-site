import React from 'react';
import PropTypes from 'prop-types';
import PropsTable from 'terra-props-table';
import Markdown from 'terra-markdown';
import IndexExampleTemplate from '../IndexPageTemplate';

const propTypes = {
  /*
   * The given component's current version
   */
  version: PropTypes.string,
  /*
   * The given component's readme file imported to a string
   */
  readme: PropTypes.string,
  examples: PropTypes.array,
  propsTables: PropTypes.array,
};

const defaultProps = {
  version: '',
  readme: '',
  examples: [],
  propsTables: [],
};

const SiteDocTemplate = (props) => {
  const { version, readme, examples, propsTables } = props;
  var id = 0;

  return (
    <div>
      {version ? <div id="version">Version: {version}</div> : null}
      {readme ? <Markdown id="readme" src={readme} /> : null}

      {examples.length > 0 ? <h1 style={{ paddingBottom: '0.3em', borderBottom: '1px solid #eaecef' }}>Examples</h1> : null}
      {examples.map(example => {
        example.id = id++;
        return <IndexExampleTemplate title={example.title} example={example.example} exampleSrc={example.source} description={example.description} key={example.id} />;
      })}

      {propsTables.map(propsTable => {
        propsTable.id = id++;
        return <PropsTable src={propsTable.componentSource} componentName={propsTable.componentName} key={propsTable.id} />
      })}
    </div>
  );
};

SiteDocTemplate.propTypes = propTypes;
SiteDocTemplate.defaultProps = defaultProps;

export default SiteDocTemplate;
