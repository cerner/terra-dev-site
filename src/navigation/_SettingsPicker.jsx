import React from 'react';
import PropTypes from 'prop-types';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import ActionFooter from 'terra-action-footer';
import Spacer from 'terra-spacer';
import Button from 'terra-button';
import { withDisclosureManager, disclosureManagerShape } from 'terra-application/lib/disclosure-manager';
import SelectField from 'terra-form-select/lib/SelectField';
import { withAppSettings } from './_AppSettingsContext';

const propTypes = {
  /**
   * Config describing the secondary navigation menu
   */
  config: PropTypes.shape({
    themes: PropTypes.arrayOf(PropTypes.string),
    locales: PropTypes.arrayOf(PropTypes.string),
    directions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,

  /**
   * The current state of app settings, set by withAppSettings
   */
  appSettings: PropTypes.shape({
    locale: PropTypes.string,
    theme: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,

  /**
   * callback for changed settings.
   */
  onChangeSettings: PropTypes.func.isRequired,

  /**
   * Injected by with disclosure manager.
   */
  disclosureManager: disclosureManagerShape.isRequired,
};

class SettingsPicker extends React.Component {
  constructor(props) {
    super(props);

    const { locale, theme, direction } = props.appSettings;

    this.state = {
      locale,
      theme,
      direction,
    };
  }

  render() {
    const { disclosureManager, config, onChangeSettings } = this.props;
    const {
      locale, theme, direction,
    } = this.state;
    const themes = Object.keys(config.themes);

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
                      onChangeSettings({
                        locale,
                        theme,
                        direction,
                      }, disclosureManager.dismiss);
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
          {config.locales.length > 1 ? (
            <SelectField
              label="Locale"
              selectId="terra-dev-site-locale-select"
              defaultValue={locale}
              onChange={(value) => {
                this.setState({
                  locale: value,
                });
              }}
            >
              {config.locales.map(value => (
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
                this.setState({
                  theme: value,
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
                this.setState({
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
  }
}

SettingsPicker.propTypes = propTypes;

export default withAppSettings(withDisclosureManager(SettingsPicker));
