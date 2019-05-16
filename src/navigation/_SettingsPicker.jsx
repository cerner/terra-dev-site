import React from 'react';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import ActionFooter from 'terra-action-footer';
import Spacer from 'terra-spacer';
import Button from 'terra-button';
import { withDisclosureManager } from 'terra-application/lib/disclosure-manager';
import SelectField from 'terra-form-select/lib/SelectField';

class SettingsPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locale: props.config.locales && props.config.locales.selectedValue,
      theme: props.config.themes && props.config.themes.selectedValue,
      direction: props.config.directions && props.config.directions.selectedValue,
    };
  }

  render() {
    const { disclosureManager, config, onChangeSettings } = this.props;
    const {
      locale, theme, direction,
    } = this.state;

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
                    variant={Button.Opts.Variants.EMPHASIS}
                    onClick={() => {
                      onChangeSettings({
                        locale: this.state.locale,
                        theme: this.state.theme,
                        direction: this.state.direction,
                      }, disclosureManager.dismiss);
                    }}
                  />
                </Spacer>
                <Button
                  text="Cancel"
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
          {config.locales ? (
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
              {config.locales.values.map(value => (
                <SelectField.Option value={value} display={value} key={value} />
              ))}
            </SelectField>
          ) : undefined}
          {config.themes ? (
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
              {config.themes.values.map(value => (
                <SelectField.Option value={value} display={value} key={value} />
              ))}
            </SelectField>
          ) : undefined}
          {config.directions ? (
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
              {config.directions.values.map(value => (
                <SelectField.Option value={value} display={value} key={value} />
              ))}
            </SelectField>
          ) : undefined}
        </Spacer>
      </ContentContainer>
    );
  }
}

export default withDisclosureManager(SettingsPicker);
