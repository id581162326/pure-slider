namespace Controller {
  export type Currents = [number] | [number, number];

  export interface MoveElements {type: 'MOVE_ELEMENTS', currents: Currents}

  export type ViewAction = MoveElements;

  export interface UpdateCurrents {type: 'UPDATE_CURRENTS', currents: Currents}

  export type ModelAction = UpdateCurrents;

  export type Of = (view: View, model: Model) => Interface;

  export type Dispatch = (action: ViewAction) => void;

  export interface View {
    update: (a: ViewAction) => void
  }

  export interface Model {
    update: (a: ModelAction) => void
  }

  export interface Interface {
    dispatch: Dispatch;
  }
}

export default Controller;