
const generateNavigationItems = (navConfig) => {
  const navigation = navConfig.navigation;
  const configuredLinks = [];

  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageType) : [];

  validLinks.forEach((link) => {
    if (!link.isHidden) {
      configuredLinks.push({
        path: link.path,
        text: link.text,
      });
    }
  });

  return {
    config: configuredLinks,
  };
};

module.exports = generateNavigationItems;
