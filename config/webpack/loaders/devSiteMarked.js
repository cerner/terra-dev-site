const marked = require('marked');
const { getOptions } = require('loader-utils');
const Prism = require('prismjs');
require('prismjs/components/prism-diff');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-scss');

// Create a list of loaded languages, remove functions that aren't actaully languages.
const supportedLanguages = Object.keys(Prism.languages).filter(lang => !['extend', 'insertBefore', 'DFS'].includes(lang));

// If the supported language is requested, highlight it.
const highlight = (code, lang) => {
  if (supportedLanguages.includes(lang)) {
    return Prism.highlight(code, Prism.languages[lang], lang);
  }

  return null;
};

marked.setOptions({
  headerIds: false,
  highlight,
  langPrefix: 'codeblock language-',
});

const renderer = new marked.Renderer();

// Override how heading renders to add the anchor.
renderer.heading = (text, level) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${escapedText}">`
          + `<a class="anchor" aria-hidden="true" tabIndex="-1" href="#${escapedText}">`
          + '<span class="icon icon-link" />'
          + '</a>'
          + `${text}`
          + `</h${level}>`;
};

const loader = async function loader(markdown) {
  const callback = this.async();

  const { baseUrl } = getOptions(this);

  // const html = marked(markdown);
  const html = marked(markdown, {
    baseUrl,
    renderer,
  }).replace(/\n/g, '\\n').replace(/'/g, '\\\'');

  const code = [
    'import React from \'react\';',
    'import classNames from \'classnames/bind\';',
    'import { ThemeContext } from \'terra-application/lib/theme\'',
    'import styles from \'terra-dev-site/lib/marked/marked.module.scss\';',
    '',
    'const cx = classNames.bind(styles);',
    '',
    `export default () => {
      const theme = React.useContext(ThemeContext);

      return (
        <div
          dir="ltr"
          className={cx('marked', theme.className)}
          dangerouslySetInnerHTML={{
            __html: '${html}',
          }}
        />
      );
    };`,
  ].join('\n');

  // console.log('code', code);

  return callback(null, code);
};

module.exports = loader;
