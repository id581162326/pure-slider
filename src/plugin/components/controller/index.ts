import Namespace from './namespace';

class Controller implements Namespace.Interface {
  static of: Namespace.Of = (view, model) => new Controller(view, model);

  public dispatch: Namespace.Dispatch = (action) => {
    switch (action.type) {
      case 'UPDATE_CURRENTS':
      case 'UPDATE_STEP':
      case 'UPDATE_RANGE':
      case 'UPDATE_MARGIN':
      case 'TOGGLE_RANGE': {
        this.model.update(action);

        break;
      }

      case 'SET_CONNECT_TYPE':
      case 'TOGGLE_SCALE':
      case 'TOGGLE_ORIENTATION':
      case 'TOGGLE_TOOLTIPS': {
        this.view.update(action);

        break;
      }

      case 'ATTACH_LISTENER': {
        this.model.attachListener(action.listener);

        break;
      }
    }
  };

  private constructor(private readonly view: Namespace.View, private readonly model: Namespace.Model) {
    this.dispatch({type: 'ATTACH_LISTENER', listener: this.viewListener});
  }

  private readonly viewListener: Namespace.Listener = {
    update: (action) => {
      switch (action.type) {
        case 'CURRENTS_UPDATED': {
          this.view.update({type: 'UPDATE_CURRENTS', currents: action.currents});

          break;
        }

        case 'RANGE_UPDATED': {
          this.view.update({type: 'UPDATE_RANGE', range: action.range});

          break;
        }

        case 'STEP_UPDATED': {
          this.view.update({type: 'UPDATE_STEP', step: action.step});
        }
      }
    }
  };
}

export default Controller;