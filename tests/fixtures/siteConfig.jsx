import siteConfig from '../src/config/site.config';
import Test from './Test';

const homeLink = [{
  path: '/site/test-page',
  text: 'Test Page',
  component: Test,
  isStatic: true,
}];

siteConfig.navigation.links = homeLink.concat(siteConfig.navigation.links);

export default siteConfig;
