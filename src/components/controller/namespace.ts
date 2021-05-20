import M from '../model/namespace'

import V from '../view/namespace';

namespace C {
  export interface UpdateHandlersPosition {
    type: 'UPDATE_HANDLERS_POSITION',
    currents: number[]
  }

  export interface SetOrientation {
    type: 'SET_ORIENTATION',
    orientation: 'horizontal' | 'vertical'
  }

  export type Action = UpdateHandlersPosition | SetOrientation;

  export interface View extends V.Interface {}

  export interface Listener extends M.Listener {}

  export interface Model extends M.Interface {}

  export interface Interface {
    initListener: () => void,
    setView: <T extends View>(view: T) => void,
    setModel: <T extends Model>(model: T) => void,
    updateState: (action: Action) => void;
  }
}

export default C;