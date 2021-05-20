import * as H from '../../globals/helpers';

import * as ViewD from '../view/defaults';

import * as ModelD from '../model/defaults';

import C from './namespace';

export const view: C.View = {
  props: ViewD.props,
  state: ViewD.state,
  render: () => {},
  destroy: () => {},
  setProps: H.trace,
  setState: H.trace,
  updateState: H.trace
}

export const model: C.Model = {
  props: ModelD.props,
  state: ModelD.state,
  setProps: H.trace,
  setState: H.trace,
  updateState: H.trace,
  setListener: H.trace
}