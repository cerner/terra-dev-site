// Make Enzyme functions available in all test files without importing
/* eslint-disable import/no-extraneous-dependencies */
import Enzyme, { mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.TERRA_AGGREGATED_LOCALES = ['en', 'es', 'de'];
global.TERRA_THEME_CONFIG = {
  scoped: [
    'clinical-lowlight-theme',
    'orion-fusion-theme',
  ],
  theme: 'orion-fusion-theme',
};
