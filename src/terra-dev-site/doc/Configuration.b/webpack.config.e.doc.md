# Webpack Config
The provided webpack config is the entry point for spinning up terra-dev-site. By either extending or using directly the terra-dev-site config will be automatically created based on either the custom or default site config.

Because terra-dev-site webpack config is a function we recommend the usage of webpack-merge to extend the config.

Something like this example where we're aliasing moment:
```javascript
const path = require('path');
const merge = require('webpack-merge');
const defaultWebpackConfig = require('terra-dev-site/config/webpack/webpack.config');

const config = () => {
  const momentAlias = path.resolve(process.cwd(), 'node_modules', 'moment');

  return {
    resolve: {
      alias: {
        moment: momentAlias,
        'terra-i18n': i18nAlias,
      },
    },
  };
};

const mergedConfig = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), config())
);

module.exports = mergedConfig;
```

[Source](https://github.com/cerner/terra-dev-site/blob/master/config/webpack/terra-dev-site.webpack.config.js)

## Points of interest
* Extends [terra-toolkit webpack config](https://github.com/cerner/terra-toolkit/blob/master/config/webpack/webpack.config.js).

* Entrypoint is defaulted to the index page in terra-dev-site.

* HtmlWebpackPlugin will run to configure the default index.html in terra-dev-site

* A resolve entry will be added to find the generated config.

* If you're a mono-repo your package repos will automatically be aliased.
