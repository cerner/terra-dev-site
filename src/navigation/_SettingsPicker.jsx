import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import ActionFooter from 'terra-action-footer';
import Spacer from 'terra-spacer';
import Button from 'terra-button';
import { DisclosureManagerContext } from 'terra-application/lib/disclosure-manager';
import SelectField from 'terra-form-select/lib/SelectField';
import AppSettingsContext from './_AppSettingsContext';

const propTypes = {
  /**
   * Config describing the secondary navigation menu
   */
  config: PropTypes.shape({
    themes: PropTypes.shape({}),
    locales: PropTypes.arrayOf(PropTypes.string),
    directions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

const SettingsPicker = ({ config }) => {
  const appSettings = React.useContext(AppSettingsContext);
  const [state, setState] = useState({ locale: appSettings.currentLocale, theme: appSettings.currentTheme, direction: appSettings.currentDirection });
  const {
    locale, theme, direction,
  } = state;
  const themes = Object.keys(config.themes);
  const disclosureManager = React.useContext(DisclosureManagerContext);

  return (
    <ContentContainer
      header={(
        <ActionHeader title="Settings" onBack={disclosureManager.goBack} onClose={disclosureManager.closeDisclosure} />
      )}
      footer={(
        <ActionFooter
          end={(
            <React.Fragment>
              <Spacer isInlineBlock marginRight="medium">
                <Button
                  text="Submit"
                  id="submit"
                  variant={Button.Opts.Variants.EMPHASIS}
                  onClick={() => {
                    appSettings.onUpdate({
                      locale,
                      theme,
                      direction,
                    });
                    disclosureManager.dismiss();
                  }}
                />
              </Spacer>
              <Button
                text="Cancel"
                id="cancel"
                onClick={() => {
                  disclosureManager.dismiss();
                }}
              />
            </React.Fragment>
          )}
        />
      )}
      fill
    >
      <Spacer padding="medium">
        {appSettings.locales.length > 1 ? (
          <SelectField
            label="Locale"
            selectId="terra-dev-site-locale-select"
            defaultValue={locale}
            onChange={(value) => {
              setState({
                locale: value,
                theme,
                direction,
              });
            }}
          >
            {appSettings.locales.map(value => (
              <SelectField.Option value={value} display={value} key={value} />
            ))}
          </SelectField>
        ) : undefined}
        {themes.length > 1 ? (
          <SelectField
            label="Theme"
            selectId="terra-dev-site-theme-select"
            defaultValue={theme}
            onChange={(value) => {
              setState({
                locale,
                theme: value,
                direction,
              });
            }}
          >
            {themes.map(value => (
              <SelectField.Option value={value} display={value} key={value} />
            ))}
          </SelectField>
        ) : undefined}
        {config.directions.length > 1 ? (
          <SelectField
            label="Direction"
            selectId="terra-dev-site-direction-select"
            defaultValue={direction}
            onChange={(value) => {
              setState({
                locale,
                theme,
                direction: value,
              });
            }}
          >
            {config.directions.map(value => (
              <SelectField.Option value={value} display={value} key={value} />
            ))}
          </SelectField>
        ) : undefined}
      </Spacer>
    </ContentContainer>
  );
};

SettingsPicker.propTypes = propTypes;

export default SettingsPicker;
