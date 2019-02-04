import React from 'react';
import {
  withRouter, Switch, Route, Redirect,
} from 'react-router-dom';
import ContentContainer from 'terra-content-container';
import SecondaryNavigationLayout from 'terra-framework/packages/terra-application-layout/lib/SecondaryNavigationLayout';
import SecondaryNavigationLayoutActionHeader from 'terra-framework/packages/terra-application-layout/lib/SecondaryNavigationLayoutActionHeader';

class AppContent extends React.Component {
  static flattenMenuItems(menuItems) {
    return menuItems.reduce((accumulatedMenuItems, item) => {
      let generatedMenuItems = [{
        text: item.text,
        key: item.path,
        hasSubMenu: item.hasSubMenu,
        childKeys: item.childItems && item.childItems.map(childItem => childItem.path),
        metaData: !item.hasSubMenu ? {
          path: item.path,
        } : undefined,
      }];

      if (item.childItems) {
        generatedMenuItems = generatedMenuItems.concat(AppContent.flattenMenuItems(item.childItems));
      }

      return accumulatedMenuItems.concat(generatedMenuItems);
    }, []);
  }

  constructor(props) {
    super(props);

    this.generateContent = this.generateContent.bind(this);

    this.state = {
      menuItems: AppContent.flattenMenuItems(props.menuItems),
      initialSelectedMenuKey: props.location.pathname,
      sortedContentPaths: Object.keys(props.contentConfig).sort().reverse(),
    };
  }

  generateContent() {
    const { contentConfig, rootPath, placeholder } = this.props;
    const { sortedContentPaths } = this.state;

    return (
      <Switch>
        {sortedContentPaths.map(path => (
          <Route
            key={path}
            path={path}
            render={() => (
              React.createElement(contentConfig[path].component.default.componentClass, contentConfig[path].component.default.props)
            )}
          />
        ))}
        <Route
          path={rootPath}
          exact
          render={() => React.createElement(placeholder.content, placeholder.props)}
        />
        <Redirect to="/404" />
      </Switch>
    );
  }

  render() {
    const { history } = this.props;
    const { menuItems, initialSelectedMenuKey } = this.state;

    if (!menuItems || menuItems.length === 1) {
      return this.generateContent();
    }

    return (
      <SecondaryNavigationLayout
        menuItems={menuItems}
        initialSelectedMenuItemKey={initialSelectedMenuKey}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          history.push(metaData.path);
        }}
        key={initialSelectedMenuKey}
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
