import React from 'react';
import PropTypes from 'prop-types';

import ContentLoaded from './_ContentLoaded';

const propTypes = {
  children: PropTypes.element.isRequired,
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
    if (this.state.hasError) {
      return (
        <ContentLoaded>
          {this.state.error.toString()}
        </ContentLoaded>
      );
    }
    return this.props.children;
  }
}

ContentErrorBoundary.propTypes = propTypes;

export default ContentErrorBoundary;
