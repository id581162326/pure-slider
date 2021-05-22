import * as H from '../../helpers';

import View from './namespace';

export const props: View.Props = {
  container: document.createElement('div'),
  range: [0, 10],
  currents: [5],
  intervals: [false, false],
  orientation: 'horizontal',
  tooltipOptions: {
    enabled: false
  },
  bemBlockClassName: 'slider-default',
  onChange: H.trace
};