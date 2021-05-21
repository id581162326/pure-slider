namespace M {
  export type Currents = [number] | [number, number];

  export interface UpdateCurrents {
    type: 'UPDATE_CURRENTS',
    currents: Currents
  }

  export type ModelAction = UpdateCurrents;

  export interface CurrentsUpdated {
    type: 'CURRENTS_UPDATED',
    currents: Currents
  }

  export type ListenerAction = CurrentsUpdated;

  export interface Listener {
    update: (action: ListenerAction) => void
  }

  export interface State {
    min: number,
    max: number,
    currents: Currents,
    step: number,
    margin: number,
    onChangeCurrents?: (currents: Currents) => void
  }

  export interface State {
  }

  export interface Interface {
    state: State,
    setState: (state: State) => void,
    updateState: (action: ModelAction) => void,
    setListener: <T extends Listener>(listener: T) => void
  }
}

export default M;