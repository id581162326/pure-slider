/* ramda */
import {forEach} from 'ramda';
/* components */
import View from './components/view';
/* locals */
import './styles.css';

const exampleViewProps = [
  {
    min: 0,
    max: 1000,
    currents: [250, 500, 750],
    intervals: [true, false, false, true],
    orientation: 'horizontal',
    container: document.querySelector('.js-example-slider-1'),
    scaleOptions: {
      enabled: true,
      measure: 100
    },
    tooltipOptions: {
      enabled: true,
      alwaysShown: false,
      prefix: 'prefix ',
      postfix: ' postfix'
    },
    classes: {
      base: 'example-slider__base',
      handler: 'example-slider__handler',
      tooltip: 'example-slider__tooltip',
      connect: 'example-slider__connect',
      scale: 'example-slider__scale'
    }
  },
  {
    min: 0,
    max: 1000,
    currents: [250, 750],
    intervals: [false, true, false],
    orientation: 'horizontal',
    container: document.querySelector('.js-example-slider-2'),
    scaleOptions: {
      enabled: true,
      measure: 100
    },
    tooltipOptions: {
      enabled: true,
      alwaysShown: false,
      prefix: 'prefix ',
      postfix: ' postfix'
    },
    classes: {
      base: 'example-slider__base',
      handler: 'example-slider__handler',
      tooltip: 'example-slider__tooltip',
      connect: 'example-slider__connect',
      scale: 'example-slider__scale'
    }
  },
  {
    min: 0,
    max: 1000,
    currents: [500],
    intervals: [true, false],
    orientation: 'horizontal',
    container: document.querySelector('.js-example-slider-3'),
    scaleOptions: {
      enabled: true,
      measure: 100
    },
    tooltipOptions: {
      enabled: true,
      alwaysShown: false,
      prefix: 'prefix ',
      postfix: ' postfix'
    },
    classes: {
      base: 'example-slider__base',
      handler: 'example-slider__handler',
      tooltip: 'example-slider__tooltip',
      connect: 'example-slider__connect',
      scale: 'example-slider__scale'
    }
  },
  {
    min: 0,
    max: 1000,
    currents: [500],
    intervals: [false, true],
    orientation: 'horizontal',
    container: document.querySelector('.js-example-slider-4'),
    scaleOptions: {
      enabled: true,
      measure: 100
    },
    tooltipOptions: {
      enabled: true,
      alwaysShown: false,
      prefix: 'prefix ',
      postfix: ' postfix'
    },
    classes: {
      base: 'example-slider__base',
      handler: 'example-slider__handler',
      tooltip: 'example-slider__tooltip',
      connect: 'example-slider__connect',
      scale: 'example-slider__scale'
    }
  }
];

forEach((exampleProps) => {
  const view = new View();
  
  view.setProps(exampleProps as typeof view.props);
  view.render();
}, exampleViewProps);
