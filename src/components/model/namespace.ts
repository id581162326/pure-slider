namespace Model {
  export interface UpdateCurrents {
    type: 'UPDATE_CURRENTS',
    currents: State['currents']
  }

  export interface CurrentsUpdated {
    type: 'CURRENTS_UPDATED',
    currents: State['currents']
  }

  export type StateActions = UpdateCurrents;

  export type ListenerActions = CurrentsUpdated;

  export interface Listener {
    update: (action: ListenerActions) => void
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
    updateState: (action: StateActions) => void,
    setListener: <T extends Listener>(listener: T) => void
  }
}

export default Model;