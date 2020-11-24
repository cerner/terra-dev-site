import React from 'react';
import classNames from 'classnames/bind';
import { ApplicationIntlContext } from '@cerner/terra-application/lib/application-intl';
import { ThemeContext } from '@cerner/terra-application/lib/theme';

import styles from './ThemedComponent.module.scss';

const cx = classNames.bind(styles);

const ThemedComponent = () => {
  const theme = React.useContext(ThemeContext);
  const applicationIntl = React.useContext(ApplicationIntlContext);
  return (
    <div className={cx('themed', theme.className)}>
      <h1>
        Themed block below
      </h1>
      <div className={cx('themed-block')} />
      <h1>
        Translated block below
      </h1>
      <h1>
        {applicationIntl.formatMessage({ id: 'Terra.devSite.themed.help' })}
      </h1>
    </div>
  );
};

export default ThemedComponent;
