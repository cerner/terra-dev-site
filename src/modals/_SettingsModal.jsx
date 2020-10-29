import React, { useState } from 'react';
import Button from 'terra-button';
import NativeSelectField from 'terra-form-select/lib/native-select/NativeSelectField';
import ApplicationModal from '@cerner/terra-application/lib/application-modal/ApplicationModal';
import classNamesBind from 'classnames/bind';
import AppSettingsContext from '../site/_AppSettingsContext';

import styles from './SettingsModal.module.scss';

const cx = classNamesBind.bind(styles);

const SettingsModal = ({onRequestClose}) => {
  const appSettings = React.useContext(AppSettingsContext);
  const [state, setState] = useState({ locale: appSettings.currentLocale, theme: appSettings.currentTheme, direction: appSettings.currentDirection });
  const {
    locale, theme, direction,
  } = state;
  const { locales, themes, directions } = appSettings;

  return (
    <ApplicationModal
      title="Settings"
      onRequestClose={onRequestClose}
    >
      <div className={cx('container')}>
        {locales.length > 1 ? (
          <NativeSelectField
            label="Locale"
            selectId="terra-dev-site-locale-select"
            value={locale}
            onChange={event => {
              setState({
                locale: event.currentTarget.value,
                theme,
                direction,
              });
            }}
            options={locales.map(value => ({ value, display: value }))}
          />
        ) : undefined}
        {themes.length > 1 ? (
          <NativeSelectField
            label="Theme"
            selectId="terra-dev-site-theme-select"
            value={theme}
            onChange={event => {
              setState({
                locale,
                theme: event.currentTarget.value,
                direction,
              });
            }}
            options={themes.map(value => ({ value, display: value }))}
          />
        ) : undefined}
        {directions.length > 1 ? (
          <NativeSelectField
            label="Direction"
            selectId="terra-dev-site-direction-select"
            value={direction}
            onChange={event => {
              setState({
                locale,
                theme,
                direction: event.currentTarget.value,
              });
            }}
            options={directions.map(value => ({ value, display: value }))}
          />
        ) : undefined}
        <div className={cx('button-container')}>
          <Button
            text="Submit"
            id="submit"
            variant={Button.Opts.Variants.EMPHASIS}
            className={cx('button')}
            onClick={() => {
              appSettings.onUpdate({
                locale,
                theme,
                direction,
              });
              onRequestClose();
            }}
          />
          <Button
            text="Cancel"
            id="cancel"
            className={cx('button')}
            onClick={() => {
              onRequestClose();
            }}
          />
        </div>
      </div>
    </ApplicationModal>
  );
};

export default SettingsModal;
