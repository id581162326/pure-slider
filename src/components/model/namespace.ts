namespace Model {
  export type Range = [number, number];

  export type Currents = number[];

  export interface UpdateCurrents {
    type: 'UPDATE_CURRENTS',
    currents: Currents
  }

  export type Action = UpdateCurrents;

  export type Of = (o: State) => Interface;

  export type Update = (action: Action) => void

  export type ValidateCurrents = (xs: Currents) => Currents;

  export type ValidateByLength = (xs: Currents) => Currents;

  export type CorrectCurrents = (xs: Currents) => Currents;

  export type CorrectByStep = (x: number) => number;

  export type CorrectToMargin = (i: number) => (x: number) => number;

  export type CorrectToRange = (x: number) => number;

  export type ValidateState = (o: State) => State;

  export type ValidateByRange = (o: State) => State;

  export type ValidateByStep = (o: State) => State;

  export type ValidateByMargin = (o: State) => State;

  export type ValidateByCurrents = (o: State) => State;

  export interface State {
    range: Range,
    currents: Currents,
    step: number,
    margin: number
  }

  export interface Interface {
    update: Update
  }
}

export default Model;