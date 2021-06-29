import Test from 'test/interface';

import {pipe} from 'fp-ts/function';
import * as H from 'helpers/index';

import Model from 'plugin/model/index';
import Namespace from 'plugin/model/namespace';
import * as Actions from 'plugin/model/actions';

const defaultState: Namespace.State = {
  coordinates: [0, 1],
  range: [0, 10],
  step: 1,
  margin: 1
};

export const initTestWithValidState: Test<Namespace.State> = {
  title: 'Init model',
  description: 'should init model',
  run: (state) => {
    const model = pipe(Model, H.instantiateWith(state));

    expect(model.state).toEqual(state);
  },
  map: [defaultState]
};

export const initTestWithInvalidRange: Test<[Namespace.State, Namespace.State]> = {
  title: 'Init model',
  description: 'should init model with invalid range and correct it',
  run: ([inputState, outputState]) => {
    const model = pipe(Model, H.instantiateWith(inputState));

    expect(model.state).toEqual(outputState);
  },
  map: [
    [{
      coordinates: [0],
      range: [0, 0],
      step: 1,
      margin: 1
    }, {
      coordinates: [0],
      range: [0, 1],
      step: 1,
      margin: 1
    }],
    [{
      coordinates: [0],
      range: [10, 0],
      step: 1,
      margin: 1
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: 1
    }]
  ]
};

export const initTestWithInvalidStep: Test<[Namespace.State, Namespace.State]> = {
  title: 'Init model',
  description: 'should init model with invalid step and correct it',
  run: ([inputState, outputState]) => {
    const model = pipe(Model, H.instantiateWith(inputState));

    expect(model.state).toEqual(outputState);
  },
  map: [
    [{
      coordinates: [0],
      range: [0, 10],
      step: 11,
      margin: 1
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 10,
      margin: 1
    }],
    [{
      coordinates: [0],
      range: [0, 10],
      step: -11,
      margin: 1
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 10,
      margin: 1
    }],
    [{
      coordinates: [0],
      range: [0, 10],
      step: -9,
      margin: 1
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 9,
      margin: 1
    }]
  ]
};

export const initTestWithInvalidMargin: Test<[Namespace.State, Namespace.State]> = {
  title: 'Init model',
  description: 'should init model with invalid margin and correct it',
  run: ([inputState, outputState]) => {
    const model = pipe(Model, H.instantiateWith(inputState));

    expect(model.state).toEqual(outputState);
  },
  map: [
    [{
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: 11
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: 10
    }],
    [{
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: -11
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: 10
    }],
    [{
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: -9
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: 9
    }]
  ]
};

export const initTestWithInvalidCoordinates: Test<[Namespace.State, Namespace.State]> = {
  title: 'Init model',
  description: 'should init model with invalid coordinates and correct it',
  run: ([inputState, outputState]) => {
    const model = pipe(Model, H.instantiateWith(inputState));

    expect(model.state).toEqual(outputState);
  },
  map: [
    [{
      coordinates: [-1],
      range: [0, 10],
      step: 1,
      margin: 1
    }, {
      coordinates: [0],
      range: [0, 10],
      step: 1,
      margin: 1
    }],
    [{
      coordinates: [11],
      range: [0, 10],
      step: 1,
      margin: 1
    }, {
      coordinates: [10],
      range: [0, 10],
      step: 1,
      margin: 1
    }],
    [{
      coordinates: [0, 0],
      range: [0, 10],
      step: 1,
      margin: 1
    }, {
      coordinates: [0, 1],
      range: [0, 10],
      step: 1,
      margin: 1
    }],
    [{
      coordinates: [-1, -2],
      range: [0, 10],
      step: 1,
      margin: 1
    }, {
      coordinates: [0, 1],
      range: [0, 10],
      step: 1,
      margin: 1
    }],
    [{
      coordinates: [12, 11],
      range: [0, 10],
      step: 1,
      margin: 1
    }, {
      coordinates: [9, 10],
      range: [0, 10],
      step: 1,
      margin: 1
    }]
  ]
};

export const dispatchTest: Test<[Namespace.Action, Namespace.State]> = {
  title: 'Dispatch method',
  description: 'should dispatch action to model',
  run: ([action, outputState]) => {
    const model = pipe(Model, H.instantiateWith(defaultState));

    model.dispatch(action);

    expect(model.state).toEqual(outputState);
  },
  map: [
    [Actions.updateCoordinates([5, 5]), {...defaultState, coordinates: [5, 6]}],
    [Actions.updateCoordinates([12, 11]), {...defaultState, coordinates: [9, 10]}],
    [Actions.updateCoordinates([-1, -2]), {...defaultState, coordinates: [0, 1]}],
    [Actions.updateRange([10, 20]), {...defaultState, coordinates: [10, 11], range: [10, 20]}],
    [Actions.updateRange([-10, 0]), {...defaultState, coordinates: [-1, 0], range: [-10, 0]}],
    [Actions.updateStep(5), {...defaultState, step: 5}],
    [Actions.updateMargin(5), {...defaultState, coordinates: [0, 5], margin: 5}]
  ]
}