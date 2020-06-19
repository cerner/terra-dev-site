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
      isCssExpanded: props.isCssExpanded,
    };

    this.handleCssToggle = this.handleCssToggle.bind(this);
    this.handleCodeToggle = this.handleCodeToggle.bind(this);
  }

  handleCssToggle() {
    this.setState(prevState => ({ isCssExpanded: !prevState.isCssExpanded }));

    if (this.state.isExpanded === true) {
      this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
    }
  }

  handleCodeToggle() {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

    if (this.state.isCssExpanded === true) {
      this.setState(prevState => ({ isCssExpanded: !prevState.isCssExpanded }));
    }
  }

  render() {
    const {
      example,
      exampleSrc,
      exampleCssSrc,
      title,
      description,
    } = this.props;

    const { isExpanded, isCssExpanded } = this.state;
    let isSelected = false;
    let isCssSelected = false;

    if (this.state.isExpanded === true) {
      isSelected = true;
    } else if (this.state.isCssExpanded === true) {
      isCssSelected = true;
    }

    return (
      <div className={cx('template')}>
        {ExampleTemplate.renderHeader(title)}
        <div className={cx('content')}>
          {ExampleTemplate.renderDescription(description)}
          {example}
        </div>
        {exampleSrc
          && (
          <div className={cx('footer')}>
            <div className={cx('button-container')}>
              <button type="button" className={cx('css-toggle', { 'is-selected': isCssSelected })} onClick={this.handleCssToggle}>
                CSS
              </button>
              <button type="button" className={cx('code-toggle', { 'is-selected': isSelected })} onClick={this.handleCodeToggle}>
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
  }
}

ExampleTemplate.propTypes = propTypes;
ExampleTemplate.defaultProps = defaultProps;

export default ExampleTemplate;
