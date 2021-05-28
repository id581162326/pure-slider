namespace Observer {
  export type Currents = [number, number] | [number];

  export type Range = [number, number];

  export interface CurrentsUpdated {
    type: 'CURRENTS_UPDATED',
    currents: Currents
  }

  export interface StepUpdated {
    type: 'STEP_UPDATED',
    step: number
  }

  export interface RangeUpdated {
    type: 'RANGE_UPDATED',
    range: Range
  }

  export interface MarginUpdated {
    type: 'MARGIN_UPDATED',
    margin: number
  }

  export type Action = CurrentsUpdated | StepUpdated | RangeUpdated | MarginUpdated;

  export type Attach = (o: Listener) => void;

  export interface Listener {
    update: (a: Action) => void
  }

  export interface Interface {
    listeners: Listener[],
    attach: Attach
  }
}

export default Observer;