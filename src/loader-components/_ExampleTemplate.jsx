import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ExampleTemplate.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The example component.
   */
  example: PropTypes.element,
  /**
   * The example source code.
   */
  exampleSrc: PropTypes.element,
  /**
   * The example title.
   */
  title: PropTypes.string,
  /**
   * The example description.
   */
  description: PropTypes.node,

  isExpanded: PropTypes.bool,
};

const defaultProps = {
  isExpanded: false,
};

const renderHeader = (title) => {
  if (title) {
    return (
      <div className={cx('header')}>
        <h2 className={cx('title')}>
          {title}
        </h2>
      </div>
    );
  }
  return null;
};

const renderDescription = (description) => {
  if (description) {
    return (
      <div className={cx('description')}>
        {description}
      </div>
    );
  }
  return null;
};

const ExampleTemplate = ({
  example, exampleSrc, title, description, isExpanded,
}) => {
  const [codeIsVisible, setCodeIsVisible] = useState(isExpanded);
  const [isBackgroundTransparent, setIsBackgroundTransparent] = useState(false);

  return (
    <div className={cx('template')}>
      {renderHeader(title)}
      <div className={cx('content', { 'dynamic-content': isBackgroundTransparent })}>
        {renderDescription(description)}
        {example}
      </div>
      {exampleSrc
        && (
        <div className={cx('footer')}>
          <div className={cx('button-container')}>
            <button type="button" className={cx('bg-toggle')} onClick={() => setIsBackgroundTransparent(!isBackgroundTransparent)}>
              Toggle Background
            </button>
            <button type="button" className={cx('code-toggle')} onClick={() => setCodeIsVisible(!codeIsVisible)}>
              <span className={cx('chevron-left')} />
              <span>Code</span>
              <span className={cx('chevron-right')} />
            </button>
          </div>
          {codeIsVisible
            && (
            <div className={cx('code')}>
              {exampleSrc}
            </div>
            )}
        </div>
        )}
    </div>
  );
};

ExampleTemplate.propTypes = propTypes;
ExampleTemplate.defaultProps = defaultProps;

export default ExampleTemplate;
