/**
* Return navigational links with the config for test evidence injected.
*/
const injectTestEvidenceLink = (navConfig) => {
  const { navigation } = navConfig;
  if (navigation.links.length) {
    for (let i = 0; i < navigation.links.length; i += 1) {
      const navigationItem = navigation.links[i];
      if (navigationItem.path === '/evidence') {
        return navigation.links;
      }
    }
  }
  return navigation.links.concat([{
    path: '/evidence',
    text: 'Evidence',
    pageTypes: ['evidence'],
    isHidden: false,
  }]);
};

module.exports = injectTestEvidenceLink;
