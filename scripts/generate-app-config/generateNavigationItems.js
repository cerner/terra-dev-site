
const generateNavigationItems = (navConfig) => {
  const navigation = navConfig.navigation;
  const configuredLinks = [];

  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.pageType) : [];

  validLinks.forEach((link) => {
    const pageType = link.pageType;

    if (pageType !== 'tests') {
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
