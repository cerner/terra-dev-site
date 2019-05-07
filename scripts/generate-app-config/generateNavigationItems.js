/**
* Generates the file representing navigation items.
*/
const generateNavigationItems = (navConfig) => {
  const { navigation } = navConfig;
  const configuredLinks = [];

  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];

  validLinks.forEach((link) => {
    configuredLinks.push({
      path: link.path,
      text: link.text,
    });
  });

  return {
    config: configuredLinks,
  };
};

module.exports = generateNavigationItems;
