import React from 'react';
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
};

class ExampleTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
      isBackgroundTransparent: false,
    };

    this.handleBgToggle = this.handleBgToggle.bind(this);
    this.handleCodeToggle = this.handleCodeToggle.bind(this);
  }

  handleBgToggle() {
    this.setState(prevState => ({ isBackgroundTransparent: !prevState.isBackgroundTransparent }));
  }

  handleCodeToggle() {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
  }

  render() {
    const {
      example,
      exampleSrc,
      title,
    } = this.props;

    const { isExpanded, isBackgroundTransparent } = this.state;

    let dynamicContentStyle = {};

    if (isBackgroundTransparent) {
      dynamicContentStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      };
    }

    return (
      <div className={cx('template')}>
        {title
          && (
          <div className={cx('header')}>
            <h2 className={cx('title')}>
              {title}
            </h2>
          </div>
          )}
        {/* eslint-disable react/forbid-dom-props */}
        <div className={cx('content')} style={dynamicContentStyle}>
          {example}
        </div>
        {/* eslint-enable react/forbid-dom-props */}
        {exampleSrc
          && (
          <div className={cx('footer')}>
            <div className={cx('button-container')}>
              <button type="button" className={cx('bg-toggle')} onClick={this.handleBgToggle}>
                Toggle Background
              </button>
              <button type="button" className={cx('code-toggle')} onClick={this.handleCodeToggle}>
                <span className={cx('chevron-left')} />
                <span>Code</span>
                <span className={cx('chevron-right')} />
              </button>
            </div>
            <div className={cx('code', { 'is-expanded': isExpanded })} aria-hidden={!isExpanded}>
              {isExpanded ? (
                exampleSrc
              ) : undefined }
            </div>
          </div>
          )}
      </div>
    );
  }
}

ExampleTemplate.propTypes = propTypes;

export default ExampleTemplate;
