import React from 'react';
import {
  withRouter, matchPath, Redirect, Switch, Route,
} from 'react-router-dom';
import SecondaryNavigationLayout from 'terra-framework/packages/terra-application-layout/lib/SecondaryNavigationLayout';

class AppContent extends React.Component {
  // static getInitialSelectedKey(pathname) {
  //   if (matchPath(pathname, '/page_1/about')) {
  //     return 'about';
  //   }

  //   if (matchPath(pathname, '/page_1/components/1')) {
  //     return 'component_1';
  //   }

  //   if (matchPath(pathname, '/page_1/components/2')) {
  //     return 'component_2';
  //   }

  //   if (matchPath(pathname, '/page_1/tests')) {
  //     return 'tests';
  //   }

  //   /**
  //    * If the path doesn't match any know values, the initial key is set to 'about'. This value is reinforced
  //    * by the Redirect to the /page_1/about page.
  //    */
  //   return 'about';
  // }

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

    this.state = {
      menuItems: AppContent.processMenuItems(props.menuItems),
    };
  }

  render() {
    const { history, contentConfig, rootPath } = this.props;
    const { menuItems } = this.state;

    if (menuItems.length <= 1) {
      return <div />;
    }

    return (
      <SecondaryNavigationLayout
        menuItems={menuItems}
        initialSelectedMenuItemKey={rootPath}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          history.push(metaData.path);
        }}
      >
        {/* <Switch>
          <Route path="/page_1/about" render={() => <CommonContent contentName="About" />} />
          <Route path="/page_1/components/1" render={() => <CommonContent contentName="Component 1" />} />
          <Route path="/page_1/components/2" render={() => <CommonContent contentName="Component 2" />} />
          <Route path="/page_1/tests" render={() => <CommonContent contentName="Tests" />} />
          <Redirect to="/page_1/about" />
        </Switch> */}
      </SecondaryNavigationLayout>
    );
  }
}

export default withRouter(AppContent);
