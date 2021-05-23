import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import Namespace from './namespace';

class Model implements Namespace.Interface {
  static of: Namespace.Of = (state) => new Model(state);

  public attachListener: Namespace.AttachListener = (listener) => {
    const {currents} = this.state;

    this.listeners.push(listener);

    this.update({type: 'UPDATE_CURRENTS', currents})
  }

  public update(action: Namespace.Action) {
    switch (action.type) {
      case 'UPDATE_CURRENTS': {
        this.validateCurrents(action.currents);

        const correctedCurrents = this.correctCurrents('change')(action.currents);

        this.state = {...this.state, currents: correctedCurrents};

        const updateListeners = (listener: Namespace.Listener) => listener.update({type: 'UPDATE_CURRENTS', currents: correctedCurrents})

        A.map(updateListeners)(this.listeners);

        break;
      }
    }
  }

  private constructor(private state: Namespace.State) {
    this.validateState(state);

    this.state = {...state, currents: this.correctCurrents('init')(state.currents)};
  }

  private readonly listeners: Namespace.Listener[] = [];

  private readonly validateCurrents: Namespace.ValidateCurrents = (currents) => pipe(currents, this.validateByLength);

  private readonly validateByLength: Namespace.ValidateByLength = (currents) => {
    const currentsLength = pipe(this.state, H.prop('currents'), A.size);

    const newCurrentsLength = pipe(currents, A.size);

    if (currentsLength !== newCurrentsLength) {
      this.invalidStateError('Length of new currents must be equal to length of old one');
    }

    return (currents);
  };

  private readonly correctCurrents: Namespace.CorrectCurrents = (type) => (newCurrents) => {
    const {currents} = this.state;

    const changed: (i: number, x: number) => boolean = (i, current) => pipe(currents, H.nthOrNone(i, NaN)) !== current;

    const correct: (i: number, x: number) => number = (i, current) => pipe(
      current,
      this.correctToStep,
      this.correctToRange,
      this.correctToMargin(i)
    );

    const setCurrent: (i: number, x: number) => number = (i, current) => type === 'init'
      ? correct(i, current)
      : type === 'change' && changed(i, current)
        ? correct(i, current)
        : current;

    return (A.mapWithIndex(setCurrent)(newCurrents) as Namespace.Currents);
  };

  private readonly correctToStep: Namespace.CorrectByStep = (current) => {
    const {step} = this.state;

    return (pipe(current, H.div(step), Math.round, H.mult(step)));
  };

  private readonly correctToMargin: Namespace.CorrectToMargin = (i) => (current) => {
    const {currents, margin} = this.state;

    const prev = H.nthOrNone(H.dec(i), NaN)(currents);

    const next = H.nthOrNone(H.inc(i), NaN)(currents);

    const hasPrevCond = !isNaN(prev) && H.sub(prev)(current) < margin;

    const hasNextCond = !isNaN(next) && H.sub(current)(next) < margin;

    if (hasPrevCond) {
      return (H.add(margin)(prev));
    }

    if (hasNextCond) {
      return (H.sub(margin)(next));
    }

    return (current);
  };

  private readonly correctToRange: Namespace.CorrectToRange = (current) => {
    const {range} = this.state;

    const min = pipe(range, NEA.head);

    const max = pipe(range, NEA.last);

    return (current < min ? min : current > max ? max : current);
  };

  private readonly invalidStateError = H.throwError('Invalid state');

  private readonly validateState: Namespace.ValidateState = (state) => pipe(
    state,
    this.validateByRange,
    this.validateByStep,
    this.validateByMargin,
    this.validateByCurrents
  );

  private readonly validateByRange: Namespace.ValidateByRange = (state) => {
    const {range} = state;

    const min = pipe(range, NEA.head);

    const max = pipe(range, NEA.last);

    if (max < min) {
      this.invalidStateError('Max value must not be less than min');
    }

    if (pipe(range, H.subAdjacent(1)) === 0) {
      this.invalidStateError('Range value must not be equal to zero');
    }

    return (state);
  };

  private readonly validateByStep: Namespace.ValidateByStep = (state) => {
    const {range, step} = state;

    if (step > pipe(range, H.subAdjacent(1))) {
      this.invalidStateError('Step value must not be more than range value');
    }

    if (step < 0) {
      this.invalidStateError('Step value must not be less than zero');
    }

    return (state);
  };

  private readonly validateByMargin: Namespace.ValidateByMargin = (state) => {
    const {range, margin} = state;

    if (margin > pipe(range, H.subAdjacent(1))) {
      this.invalidStateError('Margin value must not be more than range value');
    }

    if (margin < 0) {
      this.invalidStateError('Margin value must not be less than zero');
    }

    return (state);
  };

  private readonly validateByCurrents: Namespace.ValidateByCurrents = (state) => {
    const {currents} = state;

    const hasDescending = A.reduceWithIndex(false, (i, bool) => i > 0 && H.subAdjacent(i)(currents) < 0 ? true : bool);

    if (pipe(currents, hasDescending)) {
      this.invalidStateError('Currents must not contain descending values');
    }

    return (state);
  };
}

export default Model;