namespace Model {
  export interface State {
    min: number,
    max: number,
    step: number,
    margin: number,
    currents: number[]
  }

  export interface Interface {
    state: State,

    setState: (newState: State) => void
  }
}

export default Model;