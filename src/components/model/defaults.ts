import * as H from '../../globals/helpers'

import Model from './namespace';

export const props: Model.Props = {
  min: 0,
  max: 10,
  step: 1,
  margin: 1
};

export const state: Model.State = {
  currents: [5]
};

export const listener: Model.Listener = {
  update: H.trace
}