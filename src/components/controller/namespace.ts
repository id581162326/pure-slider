namespace Controller {
  export type Currents<Type extends 'Model' | 'View'> = Type extends 'Model'
    ? number[]
    : Type extends 'View'
      ? [number] | [number, number]
      : never;

  export interface MoveHandlers {type: 'MOVE_HANDLERS', currents: Currents<'View'>}

  export type ViewAction = MoveHandlers;

  export interface UpdateCurrents {type: 'UPDATE_CURRENTS', currents: Currents<'Model'>}

  export type ModelAction = UpdateCurrents;

  export type Listener = {
    update: Update<'Model'>
  }

  export type Of = (v: View, m: Model) => Interface;

  export type Update<Type extends 'Model' | 'View'> = (a: Type extends 'Model'
    ? ModelAction
    : Type extends 'View'
      ? ViewAction
      : never) => void;

  export type AttachListener = (o: Listener) => void;

  export type Dispatch = (a: ViewAction) => void;

  export interface View {
    update: Update<'View'>
  }

  export interface Model {
    attachListener: AttachListener,
    update: Update<'Model'>
  }

  export interface Interface {
    dispatch: Dispatch;
  }
}

export default Controller;