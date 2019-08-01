import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from './_ErrorPage';

const propTypes = {
  /**
   * children are children
   */
  children: PropTypes.element.isRequired,

  /**
   * Component to wrap around errored content
   */
  errorWrapper: PropTypes.func.isRequired,
};

class ContentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    // eslint-disable-next-line no-console
    console.error(error);
    return { hasError: true, error };
  }

  render() {
    const { errorWrapper: ErrorWrapper, children } = this.props;
    if (this.state.hasError) {
      return (
        <ErrorWrapper>
          <ErrorPage error={this.state.error.toString()} />
        </ErrorWrapper>
      );
    }
    return children;
  }
}

ContentErrorBoundary.propTypes = propTypes;

export default ContentErrorBoundary;
