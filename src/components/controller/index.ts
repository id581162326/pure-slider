import Namespace from './namespace';

class Controller implements Namespace.Interface {
  static of: Namespace.Of = (view, model) => new Controller(view, model);

  public dispatch: Namespace.Dispatch = (action) => {
    switch (action.type) {
      case 'MOVE_ELEMENTS': {
        this.model.update({type: 'UPDATE_CURRENTS', currents: action.currents});

        break;
      }
    }
  }

  private constructor(protected readonly view: Namespace.View, protected readonly model: Namespace.Model) {

  }
}

export default Controller;