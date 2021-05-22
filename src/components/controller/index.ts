import V from '../view/namespace';

import M from '../model/namespace';

import C from './namespace';
import * as D from './defaults';

export default class implements C.Interface {

  // methods

  public initListener() {
    this.model.setListener(this.listener);
  }

  public setView(view: V.Interface) {
    this.view = view;
  }

  public setModel(model: M.Interface) {
    this.model = model;
  }

  public dispatch(action: C.Action) {
    switch (action.type) {
      case 'SET_HANDLERS': {
        this.model.updateState({type: 'UPDATE_CURRENTS', currents: action.currents});

        break;
      }

      case 'SET_ORIENTATION': {
        this.view.updateProps({type: 'SET_ORIENTATION', orientation: action.orientation});
      }
    }
  }

  // properties

  private view: V.Interface = D.view;

  private model: M.Interface = D.model;

  private listener: M.Listener = {
    update: (action) => {
      switch (action.type) {
        case 'CURRENTS_UPDATED': {
          this.view.updateProps({type: 'SET_HANDLERS', currents: action.currents});

          break;
        }
      }
    }
  };
}