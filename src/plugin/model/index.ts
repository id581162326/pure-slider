import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as H from 'helpers';

import Observer from 'plugin/observer';

import Namespace from 'plugin/model/namespace';

class Model implements Namespace.Interface {
  public readonly dispatch = (action: Namespace.Action) => {
    pipe(action, this.reduce, this.applyState);

    return (this);
  };

  constructor(public state: Namespace.State) {
    this.applyState(state);
  }

  private readonly observer = new Observer<Namespace.State>();

  //

  private readonly setStateProp = <Key extends keyof Namespace.State>(
    key: Key
  ) => (value: Namespace.State[Key]) => ({...this.state, [key]: value});

  private readonly reduce = ({tag, value}: Namespace.Action) => pipe(tag, H.switchCases([
    ['UPDATE_COORDINATES', pipe(value as Namespace.State['coordinates'], this.setStateProp('coordinates'), F.constant)],
    ['UPDATE_RANGE', pipe(value as Namespace.State['range'], this.setStateProp('range'), F.constant)],
    ['UPDATE_STEP', pipe(value as Namespace.State['step'], this.setStateProp('step'), F.constant)],
    ['UPDATE_MARGIN', pipe(value as Namespace.State['margin'], this.setStateProp('margin'), F.constant)]
  ], F.constant(this.state)));

  //

  private readonly correctCoordinatesByRange = (state: Namespace.State): Namespace.State => {
    const {coordinates, range} = state;

    const min = pipe(range, NEA.head);
    const max = pipe(range, NEA.last);

    const correctCoord = (coord: number) => pipe(true, H.switchCases([
      [coord < min, F.constant(min)],
      [coord > max, F.constant(max)]
    ], F.constant(coord)));

    return ({
      ...state,
      coordinates: pipe(coordinates, A.map(correctCoord)) as Namespace.State['coordinates']
    });
  };

  private readonly correctCoordinatesByStep = (state: Namespace.State): Namespace.State => {
    const {coordinates, step, range} = state;

    const min = NEA.head(range);

    return ({
      ...state,
      coordinates: pipe(
        coordinates, A.map(flow(H.sub(min), H.div(step), Math.round, H.mult(step), H.add(min)))
      ) as Namespace.State['coordinates']
    });
  };

  private readonly correctCoordinatesByMargin = (state: Namespace.State): Namespace.State => {
    const {coordinates, range, margin} = state;

    const coordinatesIsEqual = pipe(coordinates, NEA.head) === pipe(coordinates, NEA.last);

    const correct = (idx: number, coord: number) => {
      const min = idx === 0 ? NEA.head(range)
        : coord === NEA.last(range) ? coord : pipe(coordinates, NEA.head, H.add(margin));
      const max = idx === 1 ? NEA.last(range)
        : coord === NEA.head(range) || (coord !== NEA.last(range) && coordinatesIsEqual)
          ? coord : pipe(coordinates, NEA.last, H.sub(margin));

      return (pipe(true, H.switchCases([[coord <= min, F.constant(min)], [coord >= max, F.constant(max)]], F.constant(coord))));
    };

    return ({
      ...state, coordinates: A.size(coordinates) === 2 ?
        pipe(coordinates, A.mapWithIndex(correct)) as Namespace.State['coordinates']
        : coordinates
    });
  };

  private readonly correctRange = (state: Namespace.State): Namespace.State => {
    const {range} = state;

    const rangeValue = H.subAdjacent(1)(range);

    return ({
      ...state, range: rangeValue === 0
        ? [0, 1] : pipe(range, A.sort(N.Ord)) as Namespace.State['range']
    });
  };

  private readonly correctStepAndMargin = (state: Namespace.State): Namespace.State => {
    const {step, margin, range} = state;

    const rangeValue = H.subAdjacent(1)(range);

    const correct = (x: number) => Math.abs(x) > rangeValue ? rangeValue : Math.abs(x);

    return ({
      ...state,
      step: correct(step),
      margin: correct(margin)
    });
  };

  private readonly correctState = (state: Namespace.State) => pipe(
    state, this.correctRange, this.correctStepAndMargin,
    this.correctCoordinatesByRange, this.correctCoordinatesByStep, this.correctCoordinatesByMargin
  );

  //

  private readonly mutateState = (state: Namespace.State): Namespace.State => this.state = state;

  private readonly applyState = (state: Namespace.State) => pipe(
    state, this.correctState, this.mutateState, this.observer.notify
  );
}

export default Model;