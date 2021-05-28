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

  export type Of = (o: State) => Interface;

  export type Update = (action: Action) => void;

  export type GetState = () => State;

  export type ValidateCurrents = (xs: Currents) => Currents;

  export type ValidateByLength = (xs: Currents) => Currents;

  export type CorrectCurrents = (t: 'init' | 'change') => (xs: Currents) => Currents;

  export type CorrectByStep = (x: number) => number;

  export type CorrectToMargin = (xs: Currents) => (x: number, i: number) => number;

  export type CorrectToRange = (x: number) => number;

  export type ValidateState = (o: State) => State;

  export type ValidateByRange = (o: State) => State;

  export type ValidateByStep = (o: State) => State;

  export type ValidateByMargin = (o: State) => State;

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