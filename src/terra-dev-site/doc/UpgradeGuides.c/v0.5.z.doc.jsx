/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import Markdown from 'terra-markdown';
import AboutDoc from '../../../../docs/TerraDevSiteUpgradeGuide-v0.5.0.md';
import { version } from '../../../../package.json';

const About = () => (
  <div>
    <div id="version">Version: {version}</div>
    <Markdown id="about" src={AboutDoc} />
  </div>
);

export default About;
