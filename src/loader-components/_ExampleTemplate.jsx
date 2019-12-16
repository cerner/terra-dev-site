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
  /**
   * The example description.
   */
  description: PropTypes.node,

  isExpanded: PropTypes.bool,
};

const defaultProps = {
  isExpanded: false,
};

class ExampleTemplate extends React.Component {
  static renderHeader(title) {
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
  }

  static renderDescription(description) {
    if (description) {
      return (
        <div className={cx('description')}>
          {description}
        </div>
      );
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: props.isExpanded,
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
      description,
    } = this.props;

    const { isExpanded, isBackgroundTransparent } = this.state;

    return (
      <div className={cx('template')}>
        {ExampleTemplate.renderHeader(title)}
        <div className={cx('content', { 'dynamic-content': isBackgroundTransparent })}>
          {ExampleTemplate.renderDescription(description)}
          {example}
        </div>
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
            {isExpanded
              && (
              <div className={cx('code')}>
                {exampleSrc}
              </div>
              )}
          </div>
          )}
      </div>
    );
  }
}

ExampleTemplate.propTypes = propTypes;
ExampleTemplate.defaultProps = defaultProps;

export default ExampleTemplate;
