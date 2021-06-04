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

  export interface ToggleRange {
    type: 'TOGGLE_RANGE'
  }

  export type Action = UpdateCurrents | UpdateStep | UpdateRange | UpdateMargin | ToggleRange;

  export type Listener = Observer.Listener;

  export type AttachListener = (listener: Listener) => void;

  export type ObserverInterface = Observer.Interface;

  export type Of = (state: State) => Interface;

  export type Update = (action: Action) => void;

  export type GetState = () => State;

  export type GetListeners = () => Listener[];

  export type CorrectType = 'init' | 'change';

  export type CorrectCurrents = (correctType: CorrectType, state?: State) => (currents: Currents) => Currents;

  export type CorrectMargin = (state?: State) => (marginOrStep: number) => number;

  export type CorrectRange = (range: Range) => Range;

  export type SetCurrents = (currents: Currents) => void;

  export type SetMargin = (margin: number) => void;

  export type SetStep = (step: number) => void;

  export type SetRange = (range: Range) => void;

  export interface State {
    range: Range,
    currents: Currents,
    step: number,
    margin: number
  }

  export interface Interface {
    attachListener: AttachListener,
    update: Update,
    getListeners: GetListeners,
    getState: GetState
  }
}

export default Model;