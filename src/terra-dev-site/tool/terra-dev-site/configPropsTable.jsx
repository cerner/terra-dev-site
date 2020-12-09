import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/forbid-prop-types, react/no-unused-prop-types */
const propTypes = {
  /**
   * An array describing the primary navigation items for the site.
   *
   * Each navigation item must include a path, text and the content extension to include.
   *
   * Optionally additional content may be included if it wouldn't be found by the extension search. Additional content must have a title and path and can only be displayed as a first level item in secondary navigation.
   */
  primaryNavigationItems: PropTypes.arrayOf(PropTypes.shape({
    /**
    * The url path to the primary navigation item.
    */
    path: PropTypes.string.isRequired,
    /**
    * The text for the title of the primary navigation item.
    */
    text: PropTypes.string.isRequired,
    /**
    * The extension to search for when generating pages for this primary navigation item.
    */
    contentExtension: PropTypes.string.isRequired,
    /**
    * Additional content to add to the primary navigation item outside of the extension search. Primarily used for the repo's readme.
    */
    additionalContent: PropTypes.arrayOf(PropTypes.shape({
      /**
       * The page title for the content.
       */
      title: PropTypes.string.isRequired,
      /**
       * The file path to use to import the content.
       */
      filePath: PropTypes.string.isRequired,
    })),
  })),

  /**
   * Additional directories to search for each primary navigation item extension. Can be any folder. Commonly used to pull documentation from packages contained in node_modules.
   */
  additionalSearchDirectories: PropTypes.arrayOf(PropTypes.string),

  /**
   * Side effect files to import. This can be used for setting up mock testing data.
   */
  sideEffectImportFilePaths: PropTypes.arrayOf(PropTypes.string),

  /**
   * A configuration object that defines the strings rendered within the ApplicationNavigation header.
   */
  titleConfig: PropTypes.shape({

    /**
     * Title to be displayed or set as the aria-label if a title element is passed.
     */
    title: PropTypes.string.isRequired,

    /**
     * Sub text to be display below the main title text.
     */
    subline: PropTypes.string,

    /**
     * Super text to be display above the main title text.
     */
    headline: PropTypes.string,
  }),

  /**
   * By default the site is set to this theme.
   */
  defaultTheme: PropTypes.string,

  /**
   * The sites default locale.
   */
  defaultLocale: PropTypes.string,

  /**
   * The Sites default direction.
   */
  defaultDirection: PropTypes.string,

  /**
   * The favicon for the site.
   */
  faviconFilePath: PropTypes.string,
  /**
   * A configuration object with information specifying the creation of the Extension buttons rendered within the ApplicationNavigation header.
   */
  extensionItems: PropTypes.arrayOf(PropTypes.shape({
    /**
     * A key rendered to be used as a unique react key as well as returned with the onSelectExtensionItem.
     */
    key: PropTypes.string,
    /**
     * The text to either be set as an aria-label or display text.
     */
    text: PropTypes.string,
    /**
     * The Filepath to a React element representing the themable icon for the extension.
     */
    iconPath: PropTypes.elementType,
    /**
     * The modal to launch from the extension.
     */
    modal: PropTypes.elementType,
  })),

  /**
   * Html strings to include in the head.
   */
  headHtml: PropTypes.arrayOf(PropTypes.string),

  /**
   * The pathPrefix is placed in front of the generated site's URL to allow for multiple dev sites to be generated and displayed from the same webpack config.
   *
   * Required when there are more that one dev site plugins defined for a site.
   */
  pathPrefix: PropTypes.string,

  /**
   * The dev directory housing non-transpiled code. Used to swap with the `distributionFolder` when running webpack in dev mode, to enable hot reloading.
   */
  sourceFolder: PropTypes.string,

  /**
   * The dev directory housing non-transpiled code.
   */
  distributionFolder: PropTypes.string,
};
/* eslint-enable react/forbid-prop-types, react/no-unused-prop-types */

const defaultProps = {
  primaryNavigationItems: [{
    path: '/home',
    text: 'Home',
    contentExtension: 'home',
    additionalContent: [
      {
        title: 'Home',
        filePath: 'full/path/to/package/README.md',
      },
    ],
  }, {
    path: '/components',
    text: 'Components',
    contentExtension: 'doc',
  }, {
    path: '/tests',
    text: 'Tests',
    contentExtension: 'test',
  }],
  additionalSearchDirectories: [],
  sideEffectImportFilePaths: [],
  titleConfig: {
    title: 'package title',
  },
  defaultLocale: 'en',
  defaultTheme: 'terra-default-theme',
  defaultDirection: 'ltr',
  faviconFilePath: 'terra favicon path',
  extensionItems: [],
  headHtml: [],
  sourceFolder: 'src',
  distributionFolder: 'lib',
};

const Example = () => (
  <div />
);

Example.propTypes = propTypes;
Example.defaultProps = defaultProps;

export default Example;
