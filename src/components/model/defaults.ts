import * as H from '../../globals/helpers'

import Model from './namespace';

export const state: Model.State = {
  min: 0,
  max: 10,
  currents: [5],
  step: 1,
  margin: 1
};

export const listener: Model.Listener = {
  update: H.trace
}