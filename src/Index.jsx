import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'xfc';
// This line will be resolved by webpack
// eslint-disable-next-line import/no-unresolved, import/extensions
import siteConfig from 'build/appConfig';
import Application from 'terra-application';

import DevSiteNavigation from './navigation/_DevSiteNavigation';
import './index.scss';

Provider.init({
  acls: ['*'],
  secret: () => (Promise.resolve('Success')),
});

class DevSiteApplication extends React.Component {
  constructor(props) {
    super(props);

    this.handleDirChange = this.handleDirChange.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);

    this.state = {
      locale: document.getElementsByTagName('html')[0].getAttribute('lang'),
      theme: siteConfig.defaultTheme,
    };
  }

  handleDirChange(key) {
    document.getElementsByTagName('html')[0].setAttribute('dir', key);
    this.setState({ dir: key });
  }

  handleLocaleChange(key) {
    document.getElementsByTagName('html')[0].setAttribute('lang', key);
    this.setState({ locale: key });
  }

  handleThemeChange(key) {
    this.setState({ theme: key });
  }

  render() {
    const { locale, theme, dir } = this.state;

    return (
      <HashRouter>
        <Application
          locale={locale}
          themeName={siteConfig.themes[theme]}
          themeIsGlobal
        >
          <DevSiteNavigation
            nameConfig={siteConfig.nameConfig}
            utilityConfig={siteConfig.utilityConfig}
            contentConfig={siteConfig.contentConfig}
            navigationItems={siteConfig.navigationItems}
            extensions={siteConfig.extensions}
            indexPath={siteConfig.indexPath}
            themes={siteConfig.themes}
            dir={dir}
          />
        </Application>
      </HashRouter>
    );
  }
}

ReactDOM.render(<DevSiteApplication />, document.getElementById('root'));
