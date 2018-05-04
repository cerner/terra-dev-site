
const generateNavigationItems = (navConfig) => {
  const navigation = navConfig.navigation;
  const configuredLinks = [];

  const validLinks = navigation.links ? navigation.links.filter(link => link.path && link.text && link.exampleType) : [];

  validLinks.forEach((link) => {
    const exampleType = link.exampleType;

    if (exampleType !== 'tests') {
      configuredLinks.push({
        path: link.path,
        text: link.text,
        hasSubNav: link.hasSubNav,
      });
    }
  });

  // console.log('componentsToRequire', componentsToRequire);

  return {
    config: configuredLinks,
  };
};

module.exports = generateNavigationItems;
