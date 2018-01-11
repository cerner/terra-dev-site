import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { siteConfigPropType } from '../../config/proptypes.config';
import SiteUtils from './SiteUtils';
import Placeholder from '../common/Placeholder';

const propTypes = {
  config: siteConfigPropType,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  pathRoot: PropTypes.string,
  exampleType: PropTypes.string,
  placeholderSrc: PropTypes.string,
};

const generateComponentRoutes = (config, exampleType, pathRoot, placeholderSrc) => {
  const placeholder = () => (
    <Placeholder src={placeholderSrc} />
  );

  const routes = SiteUtils.generateRoutes([], config, exampleType, pathRoot).map(
    component => (
      <Route
        key={component.fullPath}
        path={`${component.fullPath}`}
        component={component.needsPlaceholder ? placeholder : component.component}
      />
  ));

  routes.push((
    <Route
      key={pathRoot}
      path={`${pathRoot}`}
      component={placeholder}
    />
  ));

  return routes;
};

class Components extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.element && prevProps.location.pathname !== this.props.location.pathname) {
      this.element.scrollTop = 0;
    }
  }

  render() {
    const { config, exampleType, pathRoot, placeholderSrc } = this.props;

    return (
      <div
        ref={(element) => { this.element = element; }}
        style={{ height: '100%', position: 'relative', padding: '15px', overflow: 'auto' }}
      >
        <Switch>
          {generateComponentRoutes(config, exampleType, pathRoot, placeholderSrc)}
        </Switch>
      </div>
    );
  }
}

Components.propTypes = propTypes;

export default withRouter(Components);
