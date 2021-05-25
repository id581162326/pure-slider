import Namespace from './namespace';

class Controller implements Namespace.Interface {
  static of: Namespace.Of = (view, model) => new Controller(view, model);

  public dispatch: Namespace.Dispatch = (action) => {
    switch (action.type) {
      case 'MOVE_HANDLERS': {
        this.model.update({type: 'UPDATE_CURRENTS', currents: action.currents});

        break;
      }

      case 'TOGGLE_SCALE': {
        this.view.update(action);

        break;
      }

      case 'TOGGLE_ORIENTATION': {
        this.view.update(action);

        break;
      }

      case 'TOGGLE_TOOLTIPS': {
        this.view.update(action);

        break;
      }
    }
  };

  private constructor(private readonly view: Namespace.View, private readonly model: Namespace.Model) {
    this.model.observer.attach(this.listener);
  }

  private listener: Namespace.Listener = {
    update: (action) => {
      switch (action.type) {
        case 'CURRENTS_UPDATED': {
          this.view.update({type: 'MOVE_HANDLERS', currents: action.currents as Namespace.Currents});
        }
      }
    }
  };
}

export default Controller;