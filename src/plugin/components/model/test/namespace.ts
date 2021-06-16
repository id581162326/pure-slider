import Model from '../namespace';

namespace TestData {
  export interface State extends Model.State {
  }

  export interface Listener extends Model.Listener {
  }

  export type Action = Model.Action;

  export type ModelInterface = Model.Interface;

  export type GetSubjects = () => {model: ModelInterface, mockView: MockView, listener: Listener};

  export type GetState = () => State;

  export type Update = (state: Partial<State>) => void

  export interface MockView {
    getState: GetState,
    update: Update
  }

  export interface StateMap {
    state: State,
    expected: State
  }

  export interface UpdateTestMap {
    description: string,
    tests: {
      action: Action,
      expected: State
    }[]
  }
}

export default TestData;