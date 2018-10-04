# Getting Started

Terra-dev-site offers a quick site to host test examples and documentation for your react components or markdown documentation.

## Quick start:

### Installation:
``` bash
npm install terra-dev-site
```

### Pre Reqs:
* terra-toolkit 3.0.0 or greater
* react 16
* react-dom 16
* README.md in the root project directory
* Package.json in the root project directory
* es6 code in src
* transpiled code in lib

### Running terra-dev-site
Terra-dev-site is built when you use the provided webpack config and use the `tt-serve` command provided by terra-toolkit. If you have a custom webpack config, you should extend the provided webpack config using webpack-merge.

Add the following terra-toolkit command to your package.json. See the [tt-serve docs](https://github.com/cerner/terra-toolkit/tree/master/scripts/serve#cli) for more information on the command options.

```json
{
  "scripts": {
    "start": "tt-serve"
  }
}
```

### Quick Start

Then run the start command and navigate to http://localhost:8080/#/site to view the site in your browser:

```bash
npm run start
```

You will see your readme hosted on the site. Next lets add some pages.

Terra-dev-site will auto discover files base on either the default search patterns in the site.config or the file structure and file extensions used.

Add the following file to: `<package>/src/terra-dev-site/my-first-page.doc.md`

```
My first page!
```

Then re-run the site and navigate to it in your browser:
```bash
npm run start
```
Now you should be able to see your page under the components tab.

## Auto Page Discovery

By default terra-dev-site will look for files in the `./src/terra-dev-site` folder in dev mode and `./lib/terra-dev-site` for prod mode. In an monorepo it will search for files in `./packages/{src,lib}/terra-dev-site`. The file directories and file names are used to build the menu navigation of the site.

### Directories
The directories following the entry point folder (terra-dev-site by default) will be translated into part of the menu structure. The one exception is if you have a 'pageType' directory inside the entry point folder, it will be ignored. This lets you group page types together without impacting your site.

### File Naming
Files need to be named using the correct 'pageType' indicator and file extension to be added to the site. This will allow you to add any additional files to support your examples and only have the specified files added as entries to the site. The file name pattern is:

```
<filename>.<group>.<pageType>.<extension>
```

The components of the file name pattern are:
* filename - This is the name that will be added to the side menu for the site. These are sorted alphabetically.
* group - (optional) This allows you to sort menu items. The group is sorted alphabetically.
* pageType - This indicates which primary navigation item the page will be rendered under. The default pageTypes are 'home', 'doc', and 'test'.
* extension - .md .js and .jsx are supported. Any other type will have unexpected behavior.


### Auto Discovery Example
Given a directory structure like this:
```
src/
  terra-dev-site/
    doc/
      upgradeGuide.a.doc.md
      examples.c/
        supportingFile.js
        myGreatExample.doc.jsx
      example.b.doc.js
    test/
      testfile.test.js
      docInTestFolder.doc.js
```
The menu navigation result will be:
```
-Components-
  Upgrade Guide
  Example
  Examples >
     My Great Example
  Test >
     Doc In Test Folder
-Test-
  Testfile
```

## How Terra-Dev-Site Works

The terra-dev-site's webpack config calls the pre-build tool `generateAppConfig`. The generateAppConfig script builds out static configuration to the `./dev-site-config/build` folder. `generateAppConfig` also discovers pages based on its configuration. After the static config has been built, webpack continues to run, pulling in the static config and producing the webpack bundle.

## Debug
To get verbose output, add `--env.verboseGenerateAppConfig` to your webpack command or run `tds-generate-app-config -v`.

## Further customization:

Check out our [Customization docs](http://engineering.cerner.com/terra-dev-site/#/getting-started/terra-dev-site/configuration/site-config).
