import C from './namespace';
import * as D from './defaults';

export default class implements C.Interface {

  // methods

  public initListener() {
    this.model.setListener(this.listener);
  }

  public setView(view: C.View) {
    this.view = view;
  }

  public setModel(model: C.Model) {
    this.model = model;
  }

  public updateState(action: C.Action) {
    switch (action.type) {
      case 'UPDATE_HANDLERS_POSITION': {
        this.model.updateState({type: 'UPDATE_CURRENTS', currents: action.currents});

        break;
      }

      case 'SET_ORIENTATION': {
        this.view.updateState({type: 'SET_ORIENTATION', orientation: action.orientation});
      }
    }
  }

  // properties

  private view: C.View = D.view;

  private model: C.Model = D.model;

  private listener: C.Listener = {
    update: (action) => {
      switch (action.type) {
        case 'CURRENTS_UPDATED': {
          this.view.updateState({type: 'UPDATE_HANDLERS_POSITION', currents: action.currents});

          break;
        }
      }
    }
  };
}