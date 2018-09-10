/**
* Generates the file representing navigation items.
*/
const generateScreenshotLink = (navConfig) => {
  const { navigation } = navConfig;
  let addScreenshots = true;
  if (navigation.links.length) {
    for (let i = 0; i < navigation.links.length; i += 1) {
      const navigationItem = navigation.links[i];
      if (navigationItem.path === '/screenshots') {
        addScreenshots = false;
        break;
      }
    }
  }

  if (addScreenshots) {
    return navigation.links.concat([{
      path: '/screenshots',
      text: 'Screenshots',
      pageTypes: ['screenshot'],
      isHidden: false,
    }]);
  }

  return navigation.links;
};

module.exports = generateScreenshotLink;
