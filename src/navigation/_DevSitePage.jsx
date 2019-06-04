import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Switch, Route,
} from 'react-router-dom';
import SecondaryNavigationLayout from './_SecondaryNavigationLayout';
import Placeholder from '../static-pages/_PlaceholderPage';

const propTypes = {
  rootPath: PropTypes.string.isRequired,
  placeholderSrc: PropTypes.string.isRequired,
  notFoundComponent: PropTypes.node.isRequired,
  contentConfig: PropTypes.shape({
    placeholder: PropTypes.node,
    content: PropTypes.object,
    menuItems: PropTypes.object,
  }).isRequired,
  menuItems: PropTypes.PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

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
            render={() => React.createElement(contentConfig[path].component.default.componentClass, contentConfig[path].component.default.props)}
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
        {this.generateContent()}
      </SecondaryNavigationLayout>
    );
  }
}

DevSitePage.propTypes = propTypes;

export default withRouter(DevSitePage);
