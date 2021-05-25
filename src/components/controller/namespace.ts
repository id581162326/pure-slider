import Model from '../model/namespace';
import View from '../view/namespace';
import Observer from '../observer/namespace';

namespace Controller {
  export type Currents = View.Currents;

  export type ViewAction = View.Action;

  export type Of = (v: View, m: Model) => Interface;

  export type Dispatch = (a: ViewAction) => void;

  export interface Listener extends Observer.Listener {}

  export interface Observer extends Observer.Interface {}

  export interface View extends View.Interface {}

  export interface Model extends Model.Interface {}

  export interface Interface {
    dispatch: Dispatch;
  }
}

export default Controller;