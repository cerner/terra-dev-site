import React from 'react';
import {
  useLocation, useHistory, useRouteMatch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import siteConfigPropType from './siteConfigPropTypes';

import './site.module.scss';

const propTypes = {

  /**
   * The site config for the application.
   */
  siteConfig: siteConfigPropType.isRequired,

  /**
   * function to return search items
   */
  fetchSearchItems: PropTypes.func,
};

//   renderApplicationBaseChildren() {
//     const {
//       siteConfig, applicationNavigation, fetchSearchItems,
//     } = this.props;
//     return (
//       <Switch>
//         <Route exact path="/" render={this.redirectSlashRoute} />
//         { siteConfig.apps.map(app => app.path && <Route path={`/${app.path}`} key={app.path} render={this.redirectToReservedRoute} />)}

//         </Route>
//       </Switch>
//     );
//   }
//     );
//   }
// }

const Router = ({ siteConfig, children }) => {
  const isRoot = useRouteMatch('/');
  const location = useLocation();
  const history = useHistory();

  // Remove # Route if at root.
  if (isRoot && location.hash.startsWith('#/')) {
    history.replace(`/${location.hash.slice(2)}`);
    return <div />;
  }

  // Redirect to exact path from
  const pathWithoutTrailingSlash = location.pathname.length !== 1 && location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
  const primaryNavPath = siteConfig.primaryNavPathToFirstPagePathMap[pathWithoutTrailingSlash];

  if (primaryNavPath) {
    console.log('replacing ', location.pathname, ' with ', primaryNavPath);
    history.replace(primaryNavPath);
    return <div />;
  }

  return (children);
};

Router.propTypes = propTypes;

export default Router;
