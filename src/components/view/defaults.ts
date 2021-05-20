import * as H from '../../globals/helpers';

import View from './namespace';

export const props: View.Props = {
  container: document.createElement('div'),
  min: 0,
  max: 10,
  intervals: [false, false],
  tooltipOptions: {
    enabled: false
  },
  bemBlockClassName: 'pure-slider-theme',
  onChange: H.trace
};

export const state: View.State = {
  currents: [5],
  orientation: 'horizontal'
}