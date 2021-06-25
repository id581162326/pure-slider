namespace Model {
  export type UpdateCoordinates = {tag: 'UPDATE_COORDINATES', value: State['coordinates']};

  export type UpdateRange = {tag: 'UPDATE_RANGE', value: State['range']};

  export type UpdateStep = {tag: 'UPDATE_STEP', value: State['step']};

  export type UpdateMargin = {tag: 'UPDATE_MARGIN', value: State['margin']};

  export type Action = UpdateCoordinates | UpdateRange | UpdateStep | UpdateMargin;

  export interface State {
    range: [number, number],
    coordinates: [number] | [number, number],
    step: number,
    margin: number
  }

  export interface Interface {
    state: State,
    dispatch: (action: Action) => void
  }
}

export default Model;