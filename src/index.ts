import * as A from 'fp-ts/Array';

import * as H from './globals/helpers';

import View from './components/view';
import Model from './components/model';

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
    min: 0,
    max: 1000,
    step: 100,
    margin: 100,
    currents: [250, 750],
    container: document.querySelector('.js-example-slider-1') as HTMLElement,
    intervals: [true, false, true],
    orientation: 'horizontal',
    tooltipOptions: {
      enabled: true,
      alwaysShown: false
    },
    onChange: (currents) => H.trace(currents)
  },
  {
    min: 0,
    max: 1000,
    step: 10,
    margin: 500,
    currents: [200, 700],
    container: document.querySelector('.js-example-slider-2') as HTMLElement,
    intervals: [false, true, false],
    orientation: 'horizontal',
    tooltipOptions: {
      enabled: true,
      alwaysShown: true
    },
    onChange: (currents) => H.trace(currents)
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
    onChange: (currents) => H.trace(currents)
  }
];


A.map(({min, max, step, margin, currents, container, intervals, orientation, tooltipOptions, onChange}: SliderConfig) => {
  const model = new Model();

  const view = new View();

  model.setProps({min, max, step, margin});

  model.setState({currents});

  view.setProps({
    min, max, container, intervals, orientation, tooltipOptions,
    onChange: (currents) => {
      onChange(currents);
      model.updateState({type: 'UPDATE_CURRENTS', currents});
    }
  });

  view.setState({currents});

  view.render();

  model.setListener({
    update: (a) => {
      switch (a.type) {
        case 'CURRENTS_UPDATED':
          view.updateState({type: 'UPDATE_HANDLERS_POSITION', currents: a.currents});
      }
    }
  });
})(sliderConfigs);