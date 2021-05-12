import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../globals/helpers';

import Model from './namespace';
import * as d from './defaults';

export default class implements Model.Interface {
  public props: Model.Props = d.defaultProps;

  public state: Model.State = d.defaultState;

  // methods

  public setProps(props: Model.Props) {
    this.validateProps(props);

    this.props = props;
  }

  public setState(state: Model.State) {
    this.state = state;
  }

  public setListener(listener: Model.Listener) {
    this.listener = listener;
  }

  public updateState(action: Model.StateActions) {
    switch (action.type) {
      case 'UPDATE_CURRENTS':
        this.updateCurrents(action.currents);
    }
  }

  // variables

  private listener: Model.Listener = {
    update: (action) => console.log(action)
  };

  // update logic

  private updateCurrents: (xs: Model.State['currents']) => void = (newCurrents) => {
    const corrected = this.correctCurrents(newCurrents);

    this.state = {...this.state, currents: corrected};

    this.listener.update({type: 'CURRENTS_UPDATED', currents: corrected});
  };

  // correct currents logic

  private correctCurrents: (xs: number[]) => number[] = (newCurrents) => {
    const {currents} = this.state;

    const changed: (i: number, x: number) => boolean = (i, x) => pipe(currents, H.nthOrNone(i, 0)) !== x;

    const correct: (i: number, x: number) => number = (i, x) => changed(i, x)
      ? pipe(x, this.correctToStep, this.correctToMargin(i), this.correctToEnds) : x;

    return (A.mapWithIndex(correct)(newCurrents));
  };

  private correctToStep: (x: number) => number = (x) => {
    const {step} = this.props;

    return (pipe(x, H.div(step), Math.round, H.mult(step)));
  };

  private correctToMargin: (i: number) => (x: number) => number = (i) => (x) => {
    const {margin} = this.props;
    const {currents} = this.state;

    const prev = H.nthOrNone(H.dec(i), -1)(currents);
    const next = H.nthOrNone(H.inc(i), -1)(currents);

      if (prev !== -1 && H.sub(prev)(x) < margin) {
      return (H.add(margin)(prev))
    }

    if (next !== -1 && H.sub(x)(next) < margin) {
      return (H.sub(margin)(next))
    }

    return (x);
  }

  private correctToEnds: (x: number) => number = (x) => {
    const {min, max} = this.props;

    if (x < min) {
      return (min);
    }

    if (x > max) {
      return (max);
    }

    return (x);
  };

  // validate props logic

  private invalidPropError = H.throwError('Invalid prop');

  private validateProps: (p: Model.Props) => void = (props) => {
    this.validateRange(props);
    this.validateStep(props);
    this.validateMargin(props);
  };

  private validateRange: (p: Model.Props) => void = (props) => {
    const {min, max} = props;

    if (min < 0) {
      this.invalidPropError('Min value must not be less than zero');
    }

    if (max <= 0) {
      this.invalidPropError('Max value must not be less than zero or equal to it');
    }

    if (max <= min) {
      this.invalidPropError('Max value must not be less than min value or equal to it');
    }
  };

  private validateStep: (p: Model.Props) => void = (props) => {
    const {min, max, step} = props;

    if (step > H.sub(min)(max)) {
      this.invalidPropError('Step value must not be more than range value');
    }

    if (step < 0) {
      this.invalidPropError('Step value must not be less than zero');
    }
  };

  private validateMargin: (p: Model.Props) => void = (props) => {
    const {min, max, margin} = props;

    if (margin > H.sub(min)(max)) {
      this.invalidPropError('Margin value must not be more than range value');
    }

    if (margin < 0) {
      this.invalidPropError('Margin value must not be less than zero');
    }
  };
}