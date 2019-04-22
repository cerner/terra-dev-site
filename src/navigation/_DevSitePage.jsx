import React from 'react';
import {
  withRouter, Switch, Route,
} from 'react-router-dom';
import ContentContainer from 'terra-content-container';
import SecondaryNavigationLayout from './_SecondaryNavigationLayout';
import SecondaryNavigationLayoutActionHeader from './_SecondaryNavigationLayoutActionHeader';
import Placeholder from '../static-pages/_PlaceholderPage';

class DevSitePage extends React.Component {
  constructor(props) {
    super(props);

    this.generateContent = this.generateContent.bind(this);

    this.state = {
      initialSelectedMenuKey: props.location.pathname,
      sortedContentPaths: Object.keys(props.contentConfig).sort().reverse(),
    };
  }

  generateContent() {
    const {
      contentConfig, rootPath, placeholderSrc, notFoundComponent,
    } = this.props;
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
          render={() => <Placeholder src={placeholderSrc} />}
        />
        <Route render={() => notFoundComponent} />
      </Switch>
    );
  }

  render() {
    const { history, menuItems } = this.props;
    const { initialSelectedMenuKey } = this.state;

    if (!menuItems || !menuItems[0].childItems) {
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

export default withRouter(DevSitePage);
