namespace M {
  export interface UpdateCurrents {
    type: 'UPDATE_CURRENTS',
    currents: number[]
  }

  export type ModelAction = UpdateCurrents;

  export interface CurrentsUpdated {
    type: 'CURRENTS_UPDATED',
    currents: number[]
  }

  export type ListenerAction = CurrentsUpdated;

  export interface Listener {
    update: (action: ListenerAction) => void
  }

  export interface Props {
    min: number,
    max: number,
    step: number,
    margin: number
  }

  export interface State {
    currents: number[]
  }

  export interface Interface {
    props: Props,
    state: State,
    setProps: (props: Props) => void,
    setState: (state: State) => void,
    updateState: (action: ModelAction) => void,
    setListener: <T extends Listener>(listener: T) => void
  }
}

export default M;