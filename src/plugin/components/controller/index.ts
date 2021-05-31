import Namespace from './namespace';

class Controller implements Namespace.Interface {
  static of: Namespace.Of = (view, model) => new Controller(view, model);

  public dispatch: Namespace.Dispatch = (action) => {
    switch (action.type) {
      case 'UPDATE_CURRENTS':
      case 'UPDATE_STEP':
      case 'UPDATE_RANGE':
      case 'UPDATE_MARGIN': {
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
        this.addListener(action.listener);

        break;
      }
    }
  };

  private constructor(private readonly view: Namespace.View, private readonly model: Namespace.Model) {
    this.addListener(this.viewListener);
  }

  private addListener: Namespace.AddListener = (listener) => {
    this.model.observer.attach(listener);

    listener.update({type: 'CURRENTS_UPDATED', currents: this.model.getState().currents});

    listener.update({type: 'RANGE_UPDATED', range: this.model.getState().range});

    listener.update({type: 'STEP_UPDATED', step: this.model.getState().step});

    listener.update({type: 'MARGIN_UPDATED', margin: this.model.getState().margin});
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