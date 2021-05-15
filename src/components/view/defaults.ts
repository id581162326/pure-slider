import * as H from '../../globals/helpers';

import View from './namespace';

export const props: View.Props = {
  container: document.createElement('div'),
  min: 0,
  max: 10,
  intervals: [false, false],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false
  },
  bemBlockClassName: 'pure-slider-theme',
  onChange: (currents) => H.trace(currents)
};

export const state: View.State = {
  currents: [5]
}