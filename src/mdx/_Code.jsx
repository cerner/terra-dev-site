import React from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps as highlightProps } from 'prism-react-renderer';
import classNames from 'classnames/bind';
import styles from './MarkdownTags.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The html tag for this component.
   */
  children: PropTypes.node,
  /**
   * Props to apply to this component tag
   */
  className: PropTypes.string,

};

const Code = ({ children, className }) => {
  const language = (className || '').replace(/language-/, '');
  return (
    <Highlight {...highlightProps} code={children} language={language} theme={undefined}>
      {({
        className: highlightClassName,
        tokens,
        getLineProps,
        getTokenProps,
      }) => (
        <code className={[cx('code'), highlightClassName].join(' ')}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  );
};

Code.propTypes = propTypes;

export default Code;
