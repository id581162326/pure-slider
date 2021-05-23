import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import Namespace from './namespace';

class Model implements Namespace.Interface {
  static of: Namespace.Of = (state) => new Model(state);

  public update(action: Namespace.Action) {
    switch (action.type) {
      case 'UPDATE_CURRENTS': {


        break;
      }
    }
  }

  private constructor(protected state: Namespace.State) {
    this.validateState(state);

    this.update({type: 'UPDATE_CURRENTS', currents: state.currents});
  }

  private validateCurrents: Namespace.ValidateCurrents = (currents) => pipe(currents, this.validateByLength);

  private validateByLength: Namespace.ValidateByLength = (currents) => {
    const currentsLength = pipe(this.state, H.prop('currents'), A.size);

    const newCurrentsLength = pipe(currents, A.size);

    if (currentsLength !== newCurrentsLength) {
      this.invalidStateError('Length of new currents must be equal to length of old one');
    }

    return (currents);
  };

  private correctCurrents: Namespace.CorrectCurrents = (newCurrents) => {
    const {currents} = this.state;

    const changed: (i: number, x: number) => boolean = (i, current) => pipe(currents, H.nthOrNone(i, NaN)) !== current;

    const correct: (i: number, x: number) => number = (i, current) => pipe(
      current,
      this.correctToStep,
      this.correctToMargin(i),
      this.correctToRange
    );

    const setCurrent: (i: number, x: number) => number = (i, current) => changed(i, current)
      ? correct(i, current)
      : current;

    return (A.mapWithIndex(setCurrent)(newCurrents) as Namespace.Currents);
  };

  private correctToStep: Namespace.CorrectByStep = (current) => {
    const {step} = this.state;

    return (pipe(current, H.div(step), Math.round, H.mult(step)));
  };

  private correctToMargin: Namespace.CorrectToMargin = (i) => (current) => {
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

  private correctToRange: Namespace.CorrectToRange = (current) => {
    const {range} = this.state;

    const min = pipe(range, NEA.head);

    const max = pipe(range, NEA.last);

    if (current < min) {
      return (min);
    }

    if (current > max) {
      return (max);
    }

    return (current);
  };

  // validate state logic

  private invalidStateError = H.throwError('Invalid state');

  private validateState: Namespace.ValidateState = (state) => pipe(
    state,
    this.validateByRange,
    this.validateByStep,
    this.validateByMargin,
    this.validateByCurrents
  );

  private validateByRange: Namespace.ValidateByRange = (state) => {
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

  private validateByStep: Namespace.ValidateByStep = (state) => {
    const {range, step} = state;

    if (step > pipe(range, H.subAdjacent(1))) {
      this.invalidStateError('Step value must not be more than range value');
    }

    if (step < 0) {
      this.invalidStateError('Step value must not be less than zero');
    }

    return (state);
  };

  private validateByMargin: Namespace.ValidateByMargin = (state) => {
    const {range, margin} = state;

    if (margin > pipe(range, H.subAdjacent(1))) {
      this.invalidStateError('Margin value must not be more than range value');
    }

    if (margin < 0) {
      this.invalidStateError('Margin value must not be less than zero');
    }

    return (state);
  };

  private validateByCurrents: Namespace.ValidateByCurrents = (state) => {
    const {range, currents} = state;

    const min = pipe(range, NEA.head);

    const max = pipe(range, NEA.last);

    const hasDescending = A.reduceWithIndex(false, (i, bool) => i > 0 && H.subAdjacent(i)(currents) < 0 ? true : bool);

    const hasOutOfRange = A.reduce(false, (bool, x: number) => x < min || x > max ? true : bool);

    if (pipe(currents, hasDescending)) {
      this.invalidStateError('Currents must not contain descending values');
    }

    if (pipe(currents, hasOutOfRange)) {
      this.invalidStateError('Currents must not contain values out of range');
    }

    return (state);
  };
}

export default Model;