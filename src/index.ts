import {pipe} from 'fp-ts/function';

import * as H from './helpers';

import Slider from './slider';
import Namespace from './slider/namespace';

import './styles.css';

const options = {
  toggleOrientation: pipe(document, H.querySelector('.js-options__toggle-orientation'))[0] as HTMLButtonElement,
  toggleScale: pipe(document, H.querySelector('.js-options__toggle-scale'))[0] as HTMLButtonElement,
  toggleTooltip: pipe(document, H.querySelector('.js-options__toggle-tooltip'))[0] as HTMLButtonElement
}

const exampleConfig: Namespace.Props = {
  range: [-1000000, 1000000],
  step: 10000,
  margin: 100000,
  currents: [-340000, 30000],
  container: pipe(document, H.querySelector('.js-example-slider'))[0],
  connectType: 'inner-range',
  orientation: 'horizontal',
  handlerOptions: {
    showTooltip: false,
    tooltipAlwaysShown: true
  },
  scaleOptions: {
    enabled: false,
    showUnitEach: 10,
    withValue: true,
    showValueEach: 50
  }
};

const exampleSlider = new Slider(exampleConfig);

H.addEventListener('click', () => exampleSlider.toggleOrientation())(options.toggleOrientation);

H.addEventListener('click', () => exampleSlider.toggleScale())(options.toggleScale);

H.addEventListener('click', () => exampleSlider.toggleTooltips())(options.toggleTooltip);
