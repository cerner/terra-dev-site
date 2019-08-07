# Resolve plugins

These are webpack resolve plugins.

## LocalPackageAliasPlugin

This plugin aliases a local directory to work as if it was required from node modules. This ensures that the mono-repos use the components defined within for dev site and allows for run-able examples to be written as if they were being used as an npm package.

For example from within terra-framework, this require:

```javascript
import BrandFooter from 'terra-brand-footer';
```

Would transform into:

```javascript
import BrandFooter from '/root/terra-framework/packages/terra-brand-footer';
```

## DirectorySwitcherPlugin

This plugin enables hot reloading by switching all references to one folder to another. This allows for main includes and files directly referencing the dist folder to be hot reloaded. This plugin runs after dependency resolution so all aliases are applied first then the folder location is changed. This plugin does not check for the existence of a file in the new location before changing the path.

For example from within terra-framework, this require:

```javascript
import BrandFooter from 'terra-brand-footer';
```

With the LocalPackageAliasPlugin this is transformed into:

```javascript
import BrandFooter from '/root/terra-framework/packages/terra-brand-footer';
```

Then based on the main defined in brand footers package.json

```javascript
import BrandFooter from '/root/terra-framework/packages/terra-brand-footer/lib/BrandFooter.js';
```

Finally the DirectorySwitcherPlugin transforms it into this:

```javascript
import BrandFooter from '/root/terra-framework/packages/terra-brand-footer/src/BrandFooter.js';;
```
