/**
* Return navigational links with the config for test evidence injected.
*/
const injectTestEvidenceLink = (navConfig) => {
  const { navigation } = navConfig;
  let addScreenshots = true;
  if (navigation.links.length) {
    for (let i = 0; i < navigation.links.length; i += 1) {
      const navigationItem = navigation.links[i];
      if (navigationItem.path === '/evidence') {
        addScreenshots = false;
        break;
      }
    }
  }

  if (addScreenshots) {
    return navigation.links.concat([{
      path: '/evidence',
      text: 'Evidence',
      pageTypes: ['evidence'],
      isHidden: false,
    }]);
  }

  return navigation.links;
};

module.exports = injectTestEvidenceLink;
