import React from 'react';
import PropTypes from 'prop-types';
import ApplicationStatusOverlay from '@cerner/terra-application/lib/application-status-overlay';

// import ErrorPage from './_ErrorPage';

const propTypes = {
  /**
   * children are children
   */
  children: PropTypes.element.isRequired,

  /**
   * Component to wrap around errored content
   */
  // errorWrapper: PropTypes.func.isRequired,
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
    const { children } = this.props;
    if (this.state.hasError) {
      return (
        <div
          id="site"
          data-terra-dev-site-content
          // className={cx('dev-site-content')}
        >
          <ApplicationStatusOverlay
            variant="error"
            message={this.state.error.toString()}
            buttonAttrs={[
              {
                text: 'Refresh',
                key: 'Refresh',
                onClick: () => { window.location.reload(); },
              },
            ]}
          />
        </div>
      );
    }
    return children;
  }
}

ContentErrorBoundary.propTypes = propTypes;

export default ContentErrorBoundary;
