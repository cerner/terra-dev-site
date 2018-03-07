import React from 'react';
import PropTypes from 'prop-types';
import IndexExampleTemplate from '../IndexPageTemplate';
import PropsTable from 'terra-props-table';
import Markdown from 'terra-markdown';

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

class SiteDocTemplate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {version,
      readme,
      examples,
      propsTables} = this.props;

    return (
      <div>
        <div id="version">Version: {version}</div>
        <Markdown id="readme" src={readme} />

        {examples.length > 0 ? <h1 style={{ paddingBottom: '0.3em', borderBottom: '1px solid #eaecef' }}>Examples</h1> : null}
        {examples.map(example =>
          <IndexExampleTemplate title={example.title} example={example.example}
            exampleSrc={example.source} description={example.description}/>
        )}

        {propsTables.map(propsTable =>
          <PropsTable src={propsTable.componentSource} componentName={propsTable.componentName}/>
        )}
      </div>
    );
  }
}

SiteDocTemplate.propTypes = propTypes;
SiteDocTemplate.defaultProps = defaultProps;

export default SiteDocTemplate;
