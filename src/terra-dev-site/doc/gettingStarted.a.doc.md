# Getting Started

Terra-dev-site offers a quick site to host test examples and documentation for your react components or md documentation.

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
Terra-dev-site automatically gets built when you use the provided webpack config or continently, the tt:serve command provided by terra-toolkit. If you have a custom webpack config, you can either extend the provided webpack config.

Add the following command to your package.json.

```json
{
  "scripts": {
    "start": "tt:serve"
  }
}
```

Then run and navigate to the site in your browser:

```bash
npm run start
```

You should see your readme hosted on the site. Next lets add some pages.
Terra dev site will auto discover files base on site.config.

Add the following file to: `<package>/src/terra-dev-site/doc`

terra.doc.md
```
My first page!
```

Then run and navigate to the site in your browser:
```bash
npm run start
```
Now you should be able to see your page under

## Pages Auto Discovery

By default terra-dev-site will look for files in the ./src/terra-dev-site folder in dev mode and ./lib/terra-dev-site for prod mode.

### File naming
Files need to be specifically named to be added to the site. This will allow you to add any additional files to support your examples and only have the specified files added as entries to the site.

```
<filename>.<group-optional>.<pageType>.<extension(md, js, jsx)>
```

The file name components are as follows:
* filename - This is the name that will be added to the side menu for the site.
* group - Optional. This allows you to sort menu items. If not specified, the menu will be sorted alphabetically. The group will be sorted alphabetically.
* pageType - This indicates which primary navigation item the page will be grouped under. The default pageTypes are 'home', 'doc', and 'test'.
* extension - .md .js and .jsx are supported. Any other type will have unexpected behavior.

### Directories
The directories following the content entry point folder(terra-dev-site) will be translated into part of the menu structure with one exception. If you have a 'pageType' directory inside the entry point folder it will be ignored. This lets you group like page type pages together without impacting your site.

### Example
Given a directory structure like this:
```
-src
--terra-dev-site
---doc
---upgradeGuide.a.doc.md
---examples.c
----supportingFile.js
----myGreatExample.doc.jsx
--example.b.doc.js
---test
---testfile.test.js
---docInTestFolder.doc.js
```
The result will be:
```
-Components
--Upgrade Guide
--Example
--Examples
---My Great Example
--Test
---Doc In Test Folder
-Test
--Testfile
```

## How it works

The provided webpack config includes a call to the generateAppConfig script. The generateAppConfig script builds out static config to the ./dev-site-config/build folder. generateAppConfig also discovers pages based on it's configuration. After the static config has been built webpack continues to run, pulling in the static config, and producing the webpack bundle.

## Further customization:

Check out our [Customization docs](http://engineering.cerner.com/terra-dev-site/#/getting-started/terra-dev-site/configuration/site-config).
