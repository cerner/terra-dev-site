# Terra Dev Site Upgrade Guide v0.5.0
This document will provide information on upgrading from Terra Toolkit 0.x to 0.5.0.

## Webpack 4
Terra Dev Site now uses Terra-Toolkit's webpack config as a base and adds more opinion. Terra Dev Site adds an entry, the html webpack plugin and an additional resolve path. Unlike terra-toolkit, this webpack config is ready to use without needing any wrapping.

The default webpack config has been moved from `src/config/webpack.config` to `src/webpack/webpack.config`;
Much like terra-toolkit the dev and prod webpack configs have been merged into one. See that guide for more info.

## WebdriverIO
Terra Dev Site provides a default webdriver IO config. This config adds in some additional opinion based and unlike terra-toolkit should be ready out of the box.

The webdriver config pulls in the default webpack config, the root selector for tests when terra dev site is used as a driver and a before hook to refresh the page after each test.

## Terra Dev Site Config
We're preparing to generate more code on launch of terra-dev-site instead of generating it client side. For the first step we're requiring that the `site.config.js` file be placed inside a `dev-site-config` folder for better organization as well as a location to place generated items.

The placeholder image and logo image are now defaulted to the terra image.

