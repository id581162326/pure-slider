import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from './helpers';

import Slider from './slider';
import S from './slider/namespace';

import './styles.css';

const options = {
  handlers: pipe(document, H.querySelector('.js-text-field__input')) as HTMLInputElement[],
  addHandlerBtn: pipe(document, H.querySelector('.js-add-handler'))[0] as HTMLButtonElement
}

const exampleConfig: S.Props = {
  range: [-1000000, 1000000],
  step: 10000,
  margin: 100000,
  currents: [-700010, 700010],
  container: pipe(document, H.querySelector('.js-example-slider'))[0],
  intervals: [true, false, true],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: true,
    alwaysShown: true
  },
  onChangeCurrents: (currents: number[]) => {
    A.mapWithIndex((i: number, x: HTMLInputElement) => {
      x.value = pipe(currents, H.nthOrNone(i, NaN), H.toString);
    })(options.handlers);
  }
};

const exampleSlider = new Slider(exampleConfig);

H.addEventListener('click', () => exampleSlider.setHandlers([10000010, 754551]))(options.addHandlerBtn);
