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
  exampleCssSrc: PropTypes.string,
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
  exampleCssSrc: 'sample text',
};

const ExampleTemplate = ({
  example, exampleSrc, exampleCssSrc, title, description, isExpanded, isCssExpanded,
}) => {
  const [codeIsVisible, setCodeIsVisible] = useState(isExpanded);
  const [cssIsVisible, setCssIsVisible] = useState(isCssExpanded);
  const [isBackgroundTransparent, setIsBackgroundTransparent] = useState(false);
  const theme = React.useContext(ThemeContext);

  return (
    <div className={cx('template', theme.className)}>
      {ExampleTemplate.renderHeader(title)}
      <div className={cx('content')}>
        {ExampleTemplate.renderDescription(description)}
        {example}
      </div>
      <div className={cx('content', { 'dynamic-content': isBackgroundTransparent })}>
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
              <button type="button" className={cx('bg-toggle')} onClick={() => setIsBackgroundTransparent(!isBackgroundTransparent)}>
                Toggle Background
              </button>
              <button type="button" className={cx('css-toggle')} onClick={() => setCssIsVisible(!cssIsVisible)}>
                CSS
              </button>
              <button type="button" className={cx('code-toggle')} onClick={() => setCodeIsVisible(!codeIsVisible)}>
                <IconCheveronLeft className={cx('chevron')}>
                <span>Code</span>
                <IconCheveronRight className={cx('chevron')}>
              </button>
            </div>
            {codeIsVisible
              && (
                <div className={cx('code')}>
                  {exampleSrc}
                </div>
              )}
            {isCssExpanded
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
