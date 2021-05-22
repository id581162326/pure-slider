import * as H from '../../helpers'

import Model from './namespace';

export const state: Model.State = {
  range: [0, 10],
  step: 1,
  margin: 1,
  currents: [5]
};

export const listener: Model.Listener = {
  update: H.trace
}