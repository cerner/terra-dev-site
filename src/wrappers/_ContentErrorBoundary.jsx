import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.element.isRequired,
  errorWrapper: PropTypes.element,
};

class ContentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  render() {
    const { errorWrapper: ErrorWrapper, children } = this.props;
    if (this.state.hasError) {
      if (ErrorWrapper) {
        return (
          <ErrorWrapper>
            {this.state.error.toString()}
          </ErrorWrapper>
        );
      }
      return this.state.error.toString();
    }
    return children;
  }
}

ContentErrorBoundary.propTypes = propTypes;

export default ContentErrorBoundary;
