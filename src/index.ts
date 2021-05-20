import * as A from 'fp-ts/Array';

import * as H from './globals/helpers';

import Plugin from './plugin';

import './styles.css';

interface SliderConfig {
  min: number,
  max: number,
  step: number,
  margin: number,
  currents: number[],
  container: HTMLElement,
  intervals: boolean[],
  orientation: 'horizontal' | 'vertical',
  tooltipOptions: {
    enabled: boolean,
    alwaysShown: boolean
  },
  onChange: (currents: number[]) => void
}

const sliderConfigs: SliderConfig[] = [
  {
    min: 1500,
    max: 3000,
    step: 100,
    margin: 100,
    currents: [1500, 1750, 2500, 2750],
    container: document.querySelector('.js-example-slider-1') as HTMLElement,
    intervals: [true, false, true, false, true],
    orientation: 'horizontal',
    tooltipOptions: {
      enabled: true,
      alwaysShown: false
    },
    onChange: H.trace
  },
  {
    min: 1000,
    max: 2000,
    step: 10,
    margin: 500,
    currents: [1200, 1800],
    container: document.querySelector('.js-example-slider-2') as HTMLElement,
    intervals: [false, true, false],
    orientation: 'horizontal',
    tooltipOptions: {
      enabled: true,
      alwaysShown: true
    },
    onChange: H.trace
  },
  {
    min: 0,
    max: 1000000,
    step: 1,
    margin: 100,
    currents: [50000],
    container: document.querySelector('.js-example-slider-3') as HTMLElement,
    intervals: [false, false],
    orientation: 'vertical',
    tooltipOptions: {
      enabled: true,
      alwaysShown: true
    },
    onChange: H.trace
  }
];

A.map((config: SliderConfig) => {
  const plugin = new Plugin(config);

  setTimeout(() => {
    plugin.setOrientation('horizontal');
  }, 10000)
})(sliderConfigs);