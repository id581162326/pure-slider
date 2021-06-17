import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Observer from '../observer';

import Namespace from './namespace';

class Model implements Namespace.Interface {
  static of: Namespace.Of = (state) => new Model(state);

  public readonly update: Namespace.Update = (action: Namespace.Action) => {
    switch (action.type) {
      case 'UPDATE_CURRENTS': {
        this.setCurrents(action.currents);

        break;
      }

      case 'UPDATE_STEP': {
        this.setStep(action.step);

        break;
      }

      case 'UPDATE_RANGE': {
        this.setRange(action.range);

        break;
      }

      case 'UPDATE_MARGIN': {
        this.setMargin(action.margin);

        break;
      }

      case 'TOGGLE_RANGE': {
        const {currents, range, margin} = this.state;

        const max = NEA.last(range);

        const first = pipe(currents, NEA.head);

        this.setCurrents(A.size(currents) === 2
          ? [first]
          : H.add(first)(margin) < max ? [first, H.add(margin)(first)] : [H.sub(margin)(max), max]);

        break;
      }
    }
  };

  public attachListener: Namespace.AttachListener = (listener) => {
    const {currents, step, range, margin} = this.state;

    this.observer.attach(listener);

    listener.update({type: 'CURRENTS_UPDATED', currents});
    listener.update({type: 'MARGIN_UPDATED', margin});
    listener.update({type: 'STEP_UPDATED', step});
    listener.update({type: 'RANGE_UPDATED', range});
  };

  public getListeners: Namespace.GetListeners = () => this.observer.listeners;

  public getState: Namespace.GetState = () => this.state;

  private constructor(private state: Namespace.State) {
    const stateWithCorrectedRange = {
      ...state,
      range: pipe(state.range, this.correctRangeToAscending, this.correctRangeToDifferent)
    };

    const stateWithCorrectedRangeMarginAndStep = {
      ...stateWithCorrectedRange,
      margin: pipe(state.margin, this.correctMarginOrStepToPositive(), this.correctMarginOrStepToRange(stateWithCorrectedRange)),
      step: pipe(state.step, this.correctMarginOrStepToPositive(), this.correctMarginOrStepToRange(stateWithCorrectedRange))
    };

    this.state = {
      ...stateWithCorrectedRangeMarginAndStep,
      currents: pipe(
        state.currents,
        this.correctCurrentsToStep('init', stateWithCorrectedRangeMarginAndStep),
        this.correctCurrentsToRange('init', stateWithCorrectedRangeMarginAndStep),
        this.correctCurrentsToMargin('init', stateWithCorrectedRangeMarginAndStep)
      )
    };
  }

  private readonly setCurrents: Namespace.SetCurrents = (currents) => {
    this.state = {
      ...this.state, currents: pipe(
        currents,
        this.correctCurrentsToStep('change'),
        this.correctCurrentsToRange('change'),
        this.correctCurrentsToMargin('change')
      )
    };

    pipe(
      this.observer,
      H.prop('listeners'),
      A.map((listener) => listener.update({type: 'CURRENTS_UPDATED', currents: this.state.currents}))
    );
  };

  private readonly setMargin: Namespace.SetMargin = (margin) => {
    const stateWithCorrectedMargin = {
      ...this.state,
      margin: pipe(margin, this.correctMarginOrStepToPositive(), this.correctMarginOrStepToRange())
    };

    this.state = {
      ...stateWithCorrectedMargin,
      currents: pipe(
        this.state.currents,
        this.correctCurrentsToMargin('init', stateWithCorrectedMargin)
      )
    };

    pipe(
      this.observer,
      H.prop('listeners'),
      A.map((listener) => {
        listener.update({type: 'CURRENTS_UPDATED', currents: this.state.currents});
        listener.update({type: 'MARGIN_UPDATED', margin: this.state.margin});
      })
    );
  };

  private readonly setStep: Namespace.SetStep = (step) => {
    const stateWithCorrectedStep = {
      ...this.state,
      step: pipe(step, this.correctMarginOrStepToPositive(), this.correctMarginOrStepToRange())
    };

    this.state = {
      ...stateWithCorrectedStep,
      currents: pipe(
        this.state.currents,
        this.correctCurrentsToStep('init', stateWithCorrectedStep),
        this.correctCurrentsToMargin('init', stateWithCorrectedStep)
      )
    };

    pipe(
      this.observer,
      H.prop('listeners'),
      A.map((listener) => {
        listener.update({type: 'CURRENTS_UPDATED', currents: this.state.currents});
        listener.update({type: 'STEP_UPDATED', step: this.state.step});
      })
    );
  };

  private readonly setRange: Namespace.SetRange = (range) => {
    const stateWithCorrectedRange = {
      ...this.state,
      range: pipe(range, this.correctRangeToAscending, this.correctRangeToDifferent)
    };

    const stateWithCorrectedRangeStepAndMargin = {
      ...stateWithCorrectedRange,
      step: this.correctMarginOrStepToRange(stateWithCorrectedRange)(this.state.step),
      margin: this.correctMarginOrStepToRange(stateWithCorrectedRange)(this.state.margin)
    };

    this.state = {
      ...stateWithCorrectedRangeStepAndMargin,
      currents: pipe(
        this.state.currents,
        this.correctCurrentsToRange('init', stateWithCorrectedRangeStepAndMargin),
        this.correctCurrentsToMargin('init', stateWithCorrectedRangeStepAndMargin))
    };

    pipe(
      this.observer,
      H.prop('listeners'),
      A.map((listener) => {
        listener.update({type: 'CURRENTS_UPDATED', currents: this.state.currents});
        listener.update({type: 'RANGE_UPDATED', range: this.state.range});
        listener.update({type: 'STEP_UPDATED', step: this.state.step});
        listener.update({type: 'MARGIN_UPDATED', margin: this.state.margin});
      })
    );
  };

  private readonly observer: Namespace.ObserverInterface = new Observer();

  private readonly correctCurrentsToStep: Namespace.CorrectCurrents = (correctType, state = this.state) => (currents) => {
    const {range, step} = state;

    const min = pipe(range, NEA.head);
    const max = pipe(range, NEA.last);

    const oldCurrents = A.mapWithIndex((idx) => H.nthOrNone(idx, NaN)(state.currents))(currents);

    return (pipe(
      currents,
      A.zip(oldCurrents),
      A.map((coordTuple) => {
        const changed = H.subAdjacent(1)(coordTuple) !== 0;

        if (changed && correctType === 'change') {
          return (pipe(coordTuple, NEA.head, (x) => x !== max
            ? pipe(x, H.sub(min), H.div(step), Math.round, H.mult(step), H.add(min))
            : x));
        }

        if (correctType === 'init') {
          return (pipe(coordTuple, NEA.head, H.sub(min), H.div(step), Math.floor, H.mult(step), H.add(min)));
        }

        return (pipe(coordTuple, NEA.head));
      })
    ) as Namespace.Currents);
  };

  private readonly correctCurrentsToRange: Namespace.CorrectCurrents = (correctType, state = this.state) => (currents) => {
    const {range} = state;

    const min = pipe(range, NEA.head);
    const max = pipe(range, NEA.last);

    const oldCurrents = A.mapWithIndex((idx) => H.nthOrNone(idx, NaN)(state.currents))(currents);

    return (pipe(
      currents,
      A.zip(oldCurrents),
      A.map((coordTuple) => {
        const changed = H.subAdjacent(1)(coordTuple) !== 0;

        if (changed || correctType === 'init') {
          const coord = pipe(coordTuple, NEA.head);

          return (coord <= min ? min : coord >= max ? max : coord);
        }

        return (pipe(coordTuple, NEA.head));
      })
    ) as Namespace.Currents);
  };

  private readonly correctCurrentsToMargin: Namespace.CorrectCurrents = (correctType, state = this.state) => (currents) => {
    const {margin, range} = state;

    const min = pipe(range, NEA.head);
    const max = pipe(range, NEA.last);

    const oldCurrents = A.mapWithIndex((idx) => H.nthOrNone(idx, NaN)(state.currents))(currents);

    return (pipe(
      currents,
      A.zip(oldCurrents),
      A.mapWithIndex((idx, coordTuple) => {
        const coord = pipe(coordTuple, NEA.head);

        const prev = pipe(currents, H.nthOrNone(H.dec(idx), NaN));
        const next = pipe(currents, H.nthOrNone(H.inc(idx), NaN));

        const prevWithMargin = H.add(margin)(prev);
        const nextWithoutMargin = H.sub(margin)(next);

        const isInit = correctType === 'init';
        const isChange = correctType === 'change';

        const changed = H.subAdjacent(1)(coordTuple) !== 0 && isChange;

        const hasPrevCond = !isNaN(prev) && H.sub(prev)(coord) < margin && coord !== max;
        const hasNextCond = ((isInit && H.add(margin)(coord) >= max) || isChange) &&
          (!isNaN(next) && H.sub(coord)(next) < margin && coord !== min);

        if ((changed || isInit) && hasPrevCond) {
          return (prevWithMargin > max ? max : prevWithMargin);
        }

        if ((changed || isInit) && hasNextCond) {
          return (nextWithoutMargin < min ? min : nextWithoutMargin);
        }

        return (coord);
      })
    ) as Namespace.Currents);
  };

  private readonly correctRangeToAscending: Namespace.CorrectRange = (range) => {
    const min = pipe(range, NEA.head);
    const max = pipe(range, NEA.last);

    if (A.size(range) === 2 && min > max) {
      return ([max, min]);
    }

    return (range);
  };

  private readonly correctRangeToDifferent: Namespace.CorrectRange = (range) => {
    const rangeValue = pipe(range, H.subAdjacent(1));

    const oldMin = pipe(this.state.range, NEA.head);
    const min = pipe(range, NEA.head);

    if (rangeValue === 0 && min === 0) {
      return ([0, 1]);
    }

    if (rangeValue === 0) {
      return (min > oldMin ? [H.dec(min), min] : [min, H.inc(min)]);
    }

    return (range);
  };

  private readonly correctMarginOrStepToRange: Namespace.CorrectMargin = (state = this.state) => (marginOrStep) => {
    const {range} = state;

    const rangeValue = pipe(range, H.subAdjacent(1));

    if (rangeValue < marginOrStep) {
      return (rangeValue);
    }

    if (rangeValue < marginOrStep) {
      return (rangeValue);
    }

    return (marginOrStep);
  };

  private readonly correctMarginOrStepToPositive: Namespace.CorrectMargin = (_) => (marginOrStep: number): number => {
    if (marginOrStep <= 0) {
      return (1);
    }

    return (marginOrStep);
  };
}

export default Model;