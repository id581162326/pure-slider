import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import Observer from '../observer';

import Namespace from './namespace';

class Model implements Namespace.Interface {
  static of: Namespace.Of = (state) => new Model(state);

  public readonly observer = new Observer();

  public update(action: Namespace.Action) {
    switch (action.type) {
      case 'UPDATE_CURRENTS': {
        this.validateCurrents(action.currents);

        const correctedCurrents = this.correctCurrents('change')(action.currents);

        this.state = {...this.state, currents: correctedCurrents};

        pipe(
          this.observer,
          H.prop('listeners'),
          A.map((listener) => listener.update({type: 'CURRENTS_UPDATED', currents: correctedCurrents}))
        );

        break;
      }
    }
  }

  public getState: Namespace.GetState = () => this.state;

  private constructor(private state: Namespace.State) {
    this.validateState(state);

    this.state = {...state, currents: this.correctCurrents('init')(state.currents)};
  }

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

    const changed = (idx: number, current: number): boolean => pipe(currents, H.nthOrNone(idx, NaN)) !== current;

    const correctBy = (correct: (x: number, i: number) => number) => (idx: number, current: number): number => type === 'init'
      ? correct(current, idx)
      : type === 'change' && changed(idx, current)
        ? correct(current, idx)
        : current;

    return (pipe(
      newCurrents,
      A.mapWithIndex(correctBy(this.correctToStep)),
      A.mapWithIndex(correctBy(this.correctToRange)),
      (currents) => A.mapWithIndex(correctBy(this.correctToMargin(currents)))(currents)
    ));
  };

  private readonly correctToStep: Namespace.CorrectByStep = (current) => {
    const {step, range} = this.state;

    const min = pipe(range, NEA.head);

    return (pipe(current, H.sub(min), H.div(step), Math.round, H.mult(step), H.add(min)));
  };

  private readonly correctToMargin: Namespace.CorrectToMargin = (newCurrents) => (current, idx) => {
    const {margin, range} = this.state;

    const min = pipe(range, NEA.head);

    const prev = H.nthOrNone(H.dec(idx), NaN)(newCurrents);

    const next = H.nthOrNone(H.inc(idx), NaN)(newCurrents);

    const hasPrevCond = !isNaN(prev) && H.sub(prev)(current) < margin;

    const hasNextCond = current !== min && !isNaN(next) && H.sub(current)(next) < margin;

    return (hasPrevCond ? H.add(margin)(prev) : hasNextCond ? H.sub(margin)(next) : current);
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
    this.validateByMargin
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
}

export default Model;