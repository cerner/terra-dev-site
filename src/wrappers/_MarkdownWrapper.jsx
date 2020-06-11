import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ThemeContext } from 'terra-application/lib/theme';

import CodesplitWrapper from './_CodesplitWrapper';
import ContentLoaded from './_ContentLoaded';
import ContentLoading from './_ContentLoading';

import styles from './MarkdownWrapper.module.scss';

const cx = classNames.bind(styles);
const propTypes = {
  /**
   * The content to be placed within the main content area of the container.
   */
  // eslint-disable-next-line react/forbid-prop-types
  content: PropTypes.object.isRequired,
  /**
   * The props to be applied to the content.
   */
  // eslint-disable-next-line react/forbid-prop-types
  props: PropTypes.object,
};

const defaultProps = {
  props: undefined,
};

const MarkdownWrapper = (props) => {
  const theme = React.useContext(ThemeContext);

  return (
    <CodesplitWrapper
      {...props}
      fallback={<ContentLoading />}
      loadedWrapper={({ children }) => (
        <ContentLoaded>
          <div className={cx('markdown', theme.className)}>
            {children}
          </div>
        </ContentLoaded>
      )}
      errorWrapper={ContentLoaded}
    />
  );
};

MarkdownWrapper.propTypes = propTypes;
MarkdownWrapper.defaultProps = defaultProps;

export default MarkdownWrapper;
