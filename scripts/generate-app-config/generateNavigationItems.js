/**
* Generates the file representing navigation items.
*/
const generateNavigationItems = (navConfig) => {
  const { navigation } = navConfig;
  const configuredLinks = [];
  const capabilities = {};

  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageTypes) : [];

  validLinks.forEach((link) => {
    configuredLinks.push({
      path: link.path,
      text: link.text,
    });
    capabilities[link.path] = link.capabilities || {};
  });

  return {
    navigationItems: {
      config: configuredLinks,
    },
    capabilities,
  };
};

module.exports = generateNavigationItems;
