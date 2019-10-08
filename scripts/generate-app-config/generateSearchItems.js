/**
* Generates the file search items.
*/
const generateSearchItems = (contentConfig) => {
  const content = contentConfig.config;
  const config = Object.entries(content).reduce((acc, [, navItem]) => {
    Object.entries(navItem).map(([, page]) => acc.push({
      title: page.name,
      tags: page.path.replace(/\//g, ' '),
      path: page.path,
    }));
    return acc;
  }, []);

  return {
    config,
  };
};

module.exports = generateSearchItems;
