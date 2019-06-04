import React from 'react';
import PropTypes from 'prop-types';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import ActionFooter from 'terra-action-footer';
import Spacer from 'terra-spacer';
import Button from 'terra-button';
import { withDisclosureManager, disclosureManagerShape } from 'terra-application/lib/disclosure-manager';
import SelectField from 'terra-form-select/lib/SelectField';

const propTypes = {
  config: PropTypes.shape({
    themes: PropTypes.arrayOf(PropTypes.string),
    selectedTheme: PropTypes.string,
    locales: PropTypes.arrayOf(PropTypes.string),
    selectedLocale: PropTypes.string,
    directions: PropTypes.arrayOf(PropTypes.string),
    selectedDirection: PropTypes.string,
  }),
  onChangeSettings: PropTypes.func,
  disclosureManager: disclosureManagerShape.isRequired,
};

const defaultProps = {
  config: undefined,
  onChangeSettings: undefined,
};

class SettingsPicker extends React.Component {
  constructor(props) {
    super(props);

    const { selectedLocale: locale, selectedTheme: theme, selectedDirection: direction } = props.config;

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
                        locale,
                        theme,
                        direction,
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
          {config.themes.length > 1 ? (
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
              {config.themes.map(value => (
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
SettingsPicker.defaultProps = defaultProps;

export default withDisclosureManager(SettingsPicker);
