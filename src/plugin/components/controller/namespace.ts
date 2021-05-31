import Model from '../model/namespace';
import View from '../view/index/namespace';
import Observer from '../observer/namespace';

namespace Controller {
  export interface AttachListener {
    type: 'ATTACH_LISTENER',
    listener: Listener
  }

  export type Action = View.Action | Model.Action | AttachListener;

  export type Of = (view: View, model: Model) => Interface;

  export type Dispatch = (action: Action) => void;

  export type AddListener = (listener: Listener) => void;

  export interface Listener extends Observer.Listener {
  }

  export interface Observer extends Observer.Interface {
  }

  export interface View extends View.Interface {
  }

  export interface Model extends Model.Interface {
  }

  export interface Interface {
    dispatch: Dispatch;
  }
}

export default Controller;