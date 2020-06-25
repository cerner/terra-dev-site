import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ThemeContext } from 'terra-application/lib/theme';
import IconChevronLeft from 'terra-icon/lib/icon/IconChevronLeft';
import IconChevronRight from 'terra-icon/lib/icon/IconChevronRight';
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
   * The example source css.
   */
  exampleCssSrc: PropTypes.element,
  /**
   * The example title.
   */
  title: PropTypes.string,
  /**
   * The example description.
   */
  description: PropTypes.node,

  isExpanded: PropTypes.bool,

  isCssExpanded: PropTypes.bool,
};

const defaultProps = {
  isExpanded: false,
  isCssExpanded: false,
  // exampleCssSrc: 'sample text',
};

const ExampleTemplate = ({
  example, exampleSrc, exampleCssSrc, title, description, isExpanded, isCssExpanded,
}) => {
  const [codeIsVisible, setCodeIsVisible] = useState(isExpanded);
  const [cssIsVisible, setCssIsVisible] = useState(isCssExpanded);
  const theme = React.useContext(ThemeContext);
  let isCodeSelected = false;
  let isCssSelected = false;

  const handleCodeToggle = () => {
    setCodeIsVisible(!codeIsVisible);
    if (cssIsVisible === true) {
      setCssIsVisible(!cssIsVisible);
    }
  };

  const handleCssToggle = () => {
    setCssIsVisible(!cssIsVisible);
    if (codeIsVisible === true) {
      setCodeIsVisible(!codeIsVisible);
    }
  };

  if (cssIsVisible === true) {
    isCssSelected = true;
  } else if (codeIsVisible === true) {
    isCodeSelected = true;
  }

  return (
    <div className={cx('template', theme.className)}>
      <div className={cx('header')}>
        {title && (
          <h2 className={cx('title')}>
            {title}
          </h2>
        )}
      </div>
      <div className={cx('content')}>
        {description && (
          <div className={cx('description')}>
            {description}
          </div>
        )}
        {example}
      </div>
      {exampleSrc
          && (
          <div className={cx('footer')}>
            <div className={cx('button-container')}>
              <button type="button" className={cx('code-toggle', { 'is-selected': isCodeSelected })} onClick={handleCodeToggle}>
                <IconChevronLeft className={cx('chevron')} />
                <span>Code</span>
                <IconChevronRight className={cx('chevron')} />
              </button>
              <button type="button" className={cx('css-toggle', { 'is-selected': isCssSelected })} onClick={handleCssToggle}>
                CSS
              </button>
            </div>
            {codeIsVisible
              && (
                <div className={cx('code')}>
                  {exampleSrc}
                </div>
              )}
            {cssIsVisible
              && (
                <div className={cx('css')}>
                  {exampleCssSrc}
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
