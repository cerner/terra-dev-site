/**
* Return navigational links with the config for test evidence injected.
*/
const injectLink = (navConfig, link) => {
  const { navigation } = navConfig;
  if (navigation.links.length) {
    for (let i = 0; i < navigation.links.length; i += 1) {
      const navigationItem = navigation.links[i];
      if (navigationItem.path === link.path) {
        return navigation.links;
      }
    }
  }
  return navigation.links.concat([link]);
};

module.exports = injectLink;
