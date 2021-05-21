import * as H from '../../globals/helpers';

import View from './namespace';

export const props: View.Props = {
  container: document.createElement('div'),
  min: 0,
  max: 10,
  currents: [5],
  intervals: [false, false],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false
  },
  bemBlockClassName: 'slider-default',
  onChange: H.trace
};