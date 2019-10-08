import React from 'react';
import NpmBadge from '../../../src/loader-components/_NpmBadge';

const packageName = 'terra-dev-site';
const packageUrl = 'https://engineering.cerner.com/terra-dev-site';
const packageVersion = '2.13.0';

describe('NpmBadge', () => {
  it('should render custom package badge when url and version props are set', () => {
    const wrapper = shallow(<NpmBadge
      name={packageName}
      url={packageUrl}
      version={packageVersion}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
