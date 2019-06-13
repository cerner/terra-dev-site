/**
* Generates the file search items.
*/
const generateSearchItems = (contentConfig) => {
  const content = contentConfig.config;
  const config = Object.keys(content).reduce((acc, navItemKey) => {
    const navItem = content[navItemKey];
    Object.keys(navItem).map(pageKey => acc.push({
      title: navItem[pageKey].text,
      tags: navItem[pageKey].path.replace(/\//gi, ' '),
      path: navItem[pageKey].path,
    }));
    return acc;
  }, []);

  return {
    config,
  };
};

module.exports = generateSearchItems;
