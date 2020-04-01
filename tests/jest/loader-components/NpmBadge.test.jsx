import React from 'react';
import Badge from '../../../src/loader-components/_Badge';

const packageName = 'terra-dev-site';
const packageUrl = 'https://engineering.cerner.com/terra-dev-site';
const packageVersion = '2.13.0';
const packageSrcCode = 'https://github.com/cerner/terra-dev-site';

describe('Badges', () => {
  it('should render only custom package badge when url and version props are set', () => {
    const wrapper = shallow(<Badge
      name={packageName}
      url={packageUrl}
      version={packageVersion}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render only npm badge when url is not specified', () => {
    const wrapper = shallow(<Badge
      name={packageName}
      version={packageVersion}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render npm badge and source code badge when url is not specified and code is specified', () => {
    const wrapper = shallow(<Badge
      code={packageSrcCode}
      name={packageName}
      version={packageVersion}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render custom package badge and source code badge when both url and code is specified', () => {
    const wrapper = shallow(<Badge
      code={packageSrcCode}
      name={packageName}
      url={packageUrl}
      version={packageVersion}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
