import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter, Switch, Route,
} from 'react-router-dom';
import ContentContainer from 'terra-content-container';

import SecondaryNavigationLayout from './_SecondaryNavigationLayout';
import Placeholder from '../static-pages/_PlaceholderPage';
import { capabilitiesPropType } from '../site/siteConfigPropTypes';
import ComponentToolbar from './_ComponentToolbar';

const propTypes = {
  /**
   * Root path for the navigation page.
   */
  rootPath: PropTypes.string.isRequired,

  /**
   * Component to be displayed if menu item is found but not content
   */
  placeholderSrc: PropTypes.string.isRequired,

  /**
   * Component to be displayed if the route is not found.
   */
  notFoundComponent: PropTypes.node.isRequired,

  /**
   * Current content on the page
   */
  // eslint-disable-next-line react/forbid-prop-types
  pageContent: PropTypes.object.isRequired,

  /**
   * Config describing the secondary navigation menu
   */
  menuItems: PropTypes.PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })),

  /**
   * capabilities set per root route.
   */
  capabilities: capabilitiesPropType.isRequired,

  /**
   * Injected by react-router: represent where the app is now, where you want it to go,
   * or even where it was.
   */
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,

  /**
   * Injected by react-router: the object representing browser history.
   */
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

class DevSitePage extends React.Component {
  constructor(props) {
    super(props);
    const { location, pageContent } = props;

    this.generateContent = this.generateContent.bind(this);

    this.state = {
      initialSelectedMenuKey: location.pathname,
      sortedContentPaths: Object.keys(pageContent).sort().reverse(),
    };
  }

  generateContent() {
    const {
      pageContent, rootPath, placeholderSrc, notFoundComponent,
    } = this.props;
    const { sortedContentPaths } = this.state;

    return (
      <Switch>
        {sortedContentPaths.map(path => (
          <Route
            key={path}
            path={path}
            render={() => React.createElement(pageContent[path].component.default.componentClass, pageContent[path].component.default.props)}
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
    const {
      history, menuItems, location, pageContent, capabilities, rootPath,
    } = this.props;
    const { initialSelectedMenuKey } = this.state;
    const hideDevTools = !capabilities[rootPath].devTools;

    if (!menuItems) {
      if (hideDevTools) {
        return this.generateContent();
      }

      return (
        <ContentContainer
          header={(
            <ComponentToolbar />
          )}
          fill
        >
          {this.generateContent()}
        </ContentContainer>
      );
    }

    return (
      <SecondaryNavigationLayout
        menuItems={menuItems}
        isMenuOpen={pageContent[location.pathname] === undefined}
        selectedMenuItemKey={location.pathname}
        onTerminalMenuItemSelection={(childKey, metaData) => {
          history.push(metaData.path);
        }}
        hideDevTools={hideDevTools}
        key={initialSelectedMenuKey}
      >
        {this.generateContent()}
      </SecondaryNavigationLayout>
    );
  }
}

DevSitePage.propTypes = propTypes;

export default withRouter(DevSitePage);
