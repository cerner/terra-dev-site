import React from 'react';
import classNames from 'classnames/bind';
import { useIntl } from 'react-intl';
import { ThemeContext } from 'terra-application/lib/theme';

import styles from './ThemedComponent.module.scss';

const cx = classNames.bind(styles);

const ThemedComponent = () => {
  const theme = React.useContext(ThemeContext);
  const applicationIntl = useIntl();
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
