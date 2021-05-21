import M from '../model/namespace';

import V from '../view/namespace';

namespace C {
  export type Action = V.SetHandlers | V.SetOrientation;

  export interface Interface {
    initListener: () => void,
    setView: (view: V.Interface) => void,
    setModel: (model: M.Interface) => void,
    updateProps: (action: Action) => void;
  }
}

export default C;