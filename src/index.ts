import {pipe} from 'fp-ts/function';

import * as H from './helpers';

import Slider from './slider';
import Namespace from './slider/namespace';

import './styles.css';

const options = {
  handlers: pipe(document, H.querySelector('.js-text-field__input')) as HTMLInputElement[],
  addHandlerBtn: pipe(document, H.querySelector('.js-add-handler'))[0] as HTMLButtonElement
}

const exampleConfig: Namespace.Props = {
  range: [0, 10],
  step: 3,
  margin: 1,
  currents: [-6, 6],
  container: pipe(document, H.querySelector('.js-example-slider'))[0],
  intervals: [true, false, true],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: true
  }
};

const exampleSlider = new Slider(exampleConfig);

H.addEventListener('click', () => exampleSlider.moveHandlers([10000010, 754551]))(options.addHandlerBtn);
