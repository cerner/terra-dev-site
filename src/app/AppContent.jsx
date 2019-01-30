import React from 'react';
import {
  withRouter, matchPath, Switch, Route,
} from 'react-router-dom';
import ContentContainer from 'terra-content-container';
import SecondaryNavigationLayout from 'terra-framework/packages/terra-application-layout/lib/SecondaryNavigationLayout';
import SecondaryNavigationLayoutActionHeader from 'terra-framework/packages/terra-application-layout/lib/SecondaryNavigationLayoutActionHeader';

import Placeholder from './common/Placeholder';

class AppContent extends React.Component {
  static getInitialSelectedKey(pathname, menuItems) {
    if (matchPath(pathname, '/page_1/about')) {
      return 'about';
    }

    if (matchPath(pathname, '/page_1/components/1')) {
      return 'component_1';
    }

    if (matchPath(pathname, '/page_1/components/2')) {
      return 'component_2';
    }

    if (matchPath(pathname, '/page_1/tests')) {
      return 'tests';
    }

    /**
     * If the path doesn't match any know values, the initial key is set to 'about'. This value is reinforced
     * by the Redirect to the /page_1/about page.
     */
    return 'about';
  }

  static processMenuItems(menuItems) {
    return menuItems.reduce((accumulatedMenuItems, item) => {
      let generatedMenuItems = [{
        text: item.text,
        key: item.path,
        hasSubMenu: item.hasSubMenu,
        childKeys: item.childItems && item.childItems.map(childItem => childItem.path),
        metaData: {
          path: item.path,
        },
      }];

      if (item.childItems) {
        generatedMenuItems = generatedMenuItems.concat(AppContent.processMenuItems(item.childItems));
      }

      return accumulatedMenuItems.concat(generatedMenuItems);
    }, []);
  }

  constructor(props) {
    super(props);

    this.generateContent = this.generateContent.bind(this);

    this.state = {
      menuItems: AppContent.processMenuItems(props.menuItems),
      initialSelectedMenuKey: props.location.pathname,
    };
  }

  generateContent() {
    const { contentConfig } = this.props;

    return (
      <Switch>
        {Object.keys(contentConfig).sort().reverse().map(path => (
          <Route
            path={path}
            render={() => (
              React.createElement(contentConfig[path].component.default.componentClass, contentConfig[path].component.default.props)
            )}
          />
        ))}
        <Route
          render={() => (
            <Placeholder />
          )}
        />
      </Switch>
    );
  }

  render() {
    const { history } = this.props;
    const { menuItems, initialSelectedMenuKey } = this.state;

    if (!menuItems) {
      return null;
    }

    if (menuItems.length === 1) {
      return this.generateContent();
    }

    return (
      <SecondaryNavigationLayout
        menuItems={menuItems}
        initialSelectedMenuItemKey={initialSelectedMenuKey}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          history.push(metaData.path);
        }}
      >
        <ContentContainer
          header={<SecondaryNavigationLayoutActionHeader />}
          fill
        >
          {this.generateContent()}
        </ContentContainer>
      </SecondaryNavigationLayout>
    );
  }
}

export default withRouter(AppContent);
