# Wdio Config
Terra-dev-site's wdio config extends [the terra-toolkit's default wdio config](https://github.com/cerner/terra-toolkit/blob/master/config/wdio/wdio.conf.js) by:
- Adding the `data-terra-site-content` global selector
- Adding a before hook to automatically refresh the page
- Disabling the Axe landmark-one-main rule

The terra-dev-site's wdio config can be view [here](https://github.com/cerner/terra-dev-site/blob/master/config/wdio/wdio.conf.js).
