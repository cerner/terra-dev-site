/* global PATHMAP */
// PATHMAP is defined by webpack and is a maping of host regex to base path regex
// Pathmap is customizable in dev-site-config.
// We use pathmap in this way to support github pages in various forms where
// index.html for several sites are served from the same host with different base paths.
// This is built to avoid configuration on the users side.

// We only need to do this once per page visit, lets cache the value.
let cachedPath;

const basePath = () => {
  const { host, pathname } = window.location;
  if (cachedPath) {
    // Singleton!
    return cachedPath;
  }
  // If anything doesn't match or goes wrong, fall back to '/'. This supports localhost.
  cachedPath = '/';

  if (PATHMAP) {
    const pathMap = Object.values(PATHMAP);
    if (pathMap) {
      // Find an element that matchs the host regex with the current location host.
      const path = pathMap.find(element => host.match(element.host));
      if (path) {
        // Use the basePath regex to substring the current path.
        [cachedPath] = pathname.match(path.basePath);
      }
    }
  }
  return cachedPath;
};

export default basePath;
