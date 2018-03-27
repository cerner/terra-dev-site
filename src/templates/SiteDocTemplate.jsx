import React from 'react';
import PropTypes from 'prop-types';
import PropsTable from 'terra-props-table';
import Markdown from 'terra-markdown';
import IndexExampleTemplate from '../IndexPageTemplate';

const propTypes = {
  /**
   * The given component's current version
   */
  version: PropTypes.string,
  /**
   * The given component's readme file imported to a string
   */
  readme: PropTypes.string,
  /**
   * Holds objects with the following properties:
   * ```
   * title: The title of the example
   * description: A description of the example to be displayed below the title
   * example: The example to be displayed
   * source: The source code of the example
   * ```
   */
  examples: PropTypes.arrayOf(
    PropTypes.shape(
      {
        title: PropTypes.string,
        description: PropTypes.string,
        example: PropTypes.element,
        source: PropTypes.string,
      },
    ),
  ),
  /**
   * Holds objects with the following properties:
   * ```
   * componentSrc: The source code of the component
   * componentName: The name of the component
   * ```
   */
  propsTables: PropTypes.arrayOf(
    PropTypes.shape(
      {
        componentSrc: PropTypes.string,
        componentName: PropTypes.string,
      },
    ),
  ),
};

const defaultProps = {
  version: '',
  readme: '',
  examples: [],
  propsTables: [],
};

const SiteDocTemplate = (props) => {
  const { version, readme, examples, propsTables } = props;
  let id = 0;

  // Assign unique identifiers to use as keys later
  for (let i = 0; i < examples.length; i += 1) {
    examples[i].id = id;
    id += 1;
  }

  for (let i = 0; i < propsTables.length; i += 1) {
    propsTables[i].id = id;
    id += 1;
  }

  return (
    <div>
      {version ? <div id="version">Version: {version}</div> : null}
      {readme ? <Markdown id="readme" src={readme} /> : null}

      {examples.length > 0 ? <h1 id="examplesHeader" style={{ paddingBottom: '0.3em', borderBottom: '1px solid #eaecef' }}>Examples</h1> : null}
      {examples.map(example =>
        <IndexExampleTemplate title={example.title} example={example.example} exampleSrc={example.source} description={example.description} key={example.id} />,
      )}

      {propsTables.map(propsTable =>
        <PropsTable src={propsTable.componentSource} componentName={propsTable.componentName} key={propsTable.id} />,
      )}
      <p id="readme">h </p>
    </div>
  );
};

SiteDocTemplate.propTypes = propTypes;
SiteDocTemplate.defaultProps = defaultProps;

export default SiteDocTemplate;
