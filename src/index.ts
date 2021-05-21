import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from './globals/helpers';

import Slider from './slider';
import S from './slider/namespace';

import './styles.css';

const options = {
  handlers: pipe(document, H.querySelector('.js-text-field__input')) as HTMLInputElement[],
  addHandlerBtn: pipe(document, H.querySelector('.js-add-handler'))[0] as HTMLButtonElement
}

const exampleConfig: S.Props = {
  min: 0,
  max: 10,
  step: 1,
  margin: 1,
  currents: [5, 7],
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

H.addEventListener('click', () => exampleSlider.setHandlers([4]))(options.addHandlerBtn);
