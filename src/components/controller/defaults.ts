import * as H from '../../helpers';

import V from '../view/namespace';
import * as VD from '../view/defaults';

import M from '../model/namespace';
import * as MD from '../model/defaults';

export const view: V.Interface = {
  props: VD.props,
  render: () => {},
  destroy: () => {},
  setProps: H.trace,
  updateProps: H.trace
}

export const model: M.Interface = {
  state: MD.state,
  setState: H.trace,
  updateState: H.trace,
  setListener: H.trace
}