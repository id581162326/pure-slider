import Observer from '../observer/namespace';

namespace Model {
  export type Range = [number, number];

  export type Currents = [number, number] | [number];

  export interface UpdateCurrents {
    type: 'UPDATE_CURRENTS',
    currents: Currents
  }

  export interface UpdateStep {
    type: 'UPDATE_STEP',
    step: number
  }

  export interface UpdateRange {
    type: 'UPDATE_RANGE',
    range: Range
  }


  export interface UpdateMargin {
    type: 'UPDATE_MARGIN',
    margin: number
  }

  export type Action = UpdateCurrents | UpdateStep | UpdateRange | UpdateMargin;

  export type Of = (state: State) => Interface;

  export type Update = (action: Action) => void;

  export type GetState = () => State;

  export type CorrectCurrents = (correctType: 'init' | 'change') => (currents: Currents) => Currents;

  export type CorrectByStep = (coord: number) => number;

  export type CorrectToMargin = (currents: Currents) => (coord: number, idx: number) => number;

  export type CorrectToRange = (coord: number) => number;

  export type ValidateState = (state: State) => State;

  export type ValidateByRange = (state: State) => State;

  export type ValidateByStep = (state: State) => State;

  export type ValidateByMargin = (state: State) => State;

  export interface State {
    range: Range,
    currents: Currents,
    step: number,
    margin: number
  }

  export interface Interface {
    observer: Observer.Interface,
    update: Update,
    getState: GetState
  }
}

export default Model;