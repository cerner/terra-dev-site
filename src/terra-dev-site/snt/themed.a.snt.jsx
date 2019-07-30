import React from 'react';
import classNames from 'classnames/bind';
import { injectIntl, intlShape } from 'react-intl';

import styles from './Themed.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Internationalization object with translation APIs. Provided by `injectIntl`.
   */
  intl: intlShape.isRequired,
};

const Themed = ({ intl }) => (
  <div className={cx('themed')}>
    <h1>
      Themed block below
    </h1>
    <div className={cx('themed-block')} />
    <h1>
      Translated block below
    </h1>
    <h1>
      {intl.formatMessage({ id: 'Terra.devSite.themed.help' })}
    </h1>
  </div>
);

Themed.propTypes = propTypes;

export default injectIntl(Themed);
