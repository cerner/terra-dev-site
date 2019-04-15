/* global PATHMAP */

let cachedPath;

const basePath = () => {
  const { host, pathname } = window.location;
  if (cachedPath) {
    return cachedPath;
  }
  cachedPath = '/';

  if (PATHMAP) {
    const pathMap = Object.values(PATHMAP);
    if (pathMap) {
      const path = pathMap.find(element => host.match(element.host));
      if (path) {
        [cachedPath] = pathname.match(path.basePath);
      }
    }
  }
  return cachedPath;
};

export default basePath;
