import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import M from './namespace';
import * as D from './defaults';

export default class implements M.Interface {
  public state: M.State = D.state;

  // methods

  public setState(state: M.State) {
    this.state = pipe(state, this.validateState);
  }

  public setListener(listener: M.Listener) {
    this.listener = listener;
  }

  public updateState(action: M.ModelAction) {
    switch (action.type) {
      case 'UPDATE_CURRENTS': {
        this.updateCurrents(action.currents);

        break;
      }
    }
  }

  // properties

  private listener: M.Listener = D.listener;

  // update currents logic

  private updateCurrents: (xs: M.Currents) => void = (currents) => {
    const corrected = pipe(currents, this.validateCurrents, this.correctCurrents);

    this.state = {...this.state, currents: corrected};

    this.listener.update({type: 'CURRENTS_UPDATED', currents: corrected});
  };

  // validate currents logic

  private validateCurrents: (xs: M.Currents) => M.Currents = (currents) => pipe(currents, this.validateByLength);

  private validateByLength: (xs: M.Currents) => M.Currents = (currents) => {
    const currentsLength = pipe(this.state, H.prop('currents'), A.size);

    const newCurrentsLength = pipe(currents, A.size);

    if (currentsLength !== newCurrentsLength) {
      this.invalidStateError('Length of new currents must be equal to length of old one');
    }

    return (currents);
  };

  // correct currents logic

  private correctCurrents: (xs: M.Currents) => M.Currents = (newCurrents) => {
    const {currents} = this.state;

    const changed: (i: number, x: number) => boolean = (i, current) => pipe(currents, H.nthOrNone(i, NaN)) !== current;

    const correct: (i: number, x: number) => number = (i, current) => pipe(
      current,
      this.correctToStep,
      this.correctToMargin(i),
      this.correctToEnds
    );

    const setCurrent: (i: number, x: number) => number = (i, current) => changed(i, current)
      ? correct(i, current)
      : current;

    return (A.mapWithIndex(setCurrent)(newCurrents) as M.Currents);
  };

  private correctToStep: (x: number) => number = (current) => {
    const {step} = this.state;

    return (pipe(current, H.div(step), Math.round, H.mult(step)));
  };

  private correctToMargin: (i: number) => (x: number) => number = (i) => (current) => {
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

  private correctToEnds: (x: number) => number = (current) => {
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

  private validateState: (o: M.State) => M.State = (state) => pipe(
    state,
    this.validateByRange,
    this.validateByStep,
    this.validateByMargin,
    this.validateByCurrents
  );

  private validateByRange: (o: M.State) => M.State = (state) => {
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

  private validateByStep: (o: M.State) => M.State = (state) => {
    const {range, step} = state;

    if (step > pipe(range, H.subAdjacent(1))) {
      this.invalidStateError('Step value must not be more than range value');
    }

    if (step < 0) {
      this.invalidStateError('Step value must not be less than zero');
    }

    return (state);
  };

  private validateByMargin: (o: M.State) => M.State = (state) => {
    const {range, margin} = state;

    if (margin > pipe(range, H.subAdjacent(1))) {
      this.invalidStateError('Margin value must not be more than range value');
    }

    if (margin < 0) {
      this.invalidStateError('Margin value must not be less than zero');
    }

    return (state);
  };

  private validateByCurrents: (o: M.State) => M.State = (state) => {
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