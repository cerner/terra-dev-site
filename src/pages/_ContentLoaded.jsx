import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import classNamesBind from 'classnames/bind';
import { ThemeContext } from '@cerner/terra-application/lib/theme';

import styles from './ContentLoaded.module.scss';

const cx = classNamesBind.bind(styles);

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
};

const ContentLoaded = ({ children, className }) => {
  const theme = React.useContext(ThemeContext);

  // Re enable if hash links aren't working
  // useEffect(() => {
  //   if (!window.location || window.location.length < 2) {
  //     return;
  //   }
  //   const elementName = window.location.hash.slice(1);
  //   const element = document.getElementById(elementName);
  //   if (element) {
  //     element.scrollIntoView();
  //   }
  // }, []);

  classNames(
    cx(
      'dev-site-content',
      theme.className,
    ),
    className,
  );

  return (
    <div
      id="site"
      data-terra-dev-site-content
      className={classNames(
        cx(
          'dev-site-content',
          theme.className,
        ),
        className,
      )}
    >
      {children}
    </div>
  );
};

ContentLoaded.propTypes = propTypes;

export default ContentLoaded;
