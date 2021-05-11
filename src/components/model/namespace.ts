namespace Model {
  export interface UpdateCurrents {
    type: 'UPDATE_CURRENT',
    currents: Props['currents']
  }

  export type Action = UpdateCurrents;

  export interface Listener {
    update: (action: Action) => void
  }

  export interface Props {
    min: number,
    max: number,
    step: number,
    margin: number,
    currents: number[],
    floatCurrents: boolean
  }

  export interface Interface {
    props: Props,

    setListener: <T extends Listener>(listener: T) => void
  }
}

export default Model;