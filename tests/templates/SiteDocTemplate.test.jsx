import React from 'react';
import SiteDocTemplate from '../../src/templates/SiteDocTemplate';

// Snapshot Tests
it('should render a default component with nothing', () => {
  const wrapper = shallow(<SiteDocTemplate />);
  expect(wrapper).toMatchSnapshot();
});

it('should show the version', () => {
  const wrapper = shallow(<SiteDocTemplate version="1.9" />);
  expect(wrapper).toMatchSnapshot();
});
