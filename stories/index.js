import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Clock from './../components/Clock';
import IframeGCalEmbed from './../components/IframeGCalEmbed';

import PanelV1 from './../components/PanelV1';

storiesOf('Individual Components', module)
  .add('Calendar', () => (
    <IframeGCalEmbed
      src="438ub15gkkij90v319t7o1bfes%40group.calendar.google.com"
      style={{ borderWidth: 0 }}
      width="800"
      height="600"
      frameBorder="0"
      scrolling="no"
    />
  ))
  .add('Weather', () => <div>Empty</div>)
  .add('METAR', () => <div>Empty</div>)
  .add('Clock', () => <Clock />);

storiesOf('Panels', module)
  .add('V1', () => <PanelV1 />);
