import React from 'react';
import marked from 'marked';

/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import TestFilePropsTable from '!terra-props-table-loader!./testfile.jsx';
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */

const Example = () => (
  <div
    dangerouslySetInnerHTML={{
      __html: marked(TestFilePropsTable),
    }}
  />
);

export default Example;
