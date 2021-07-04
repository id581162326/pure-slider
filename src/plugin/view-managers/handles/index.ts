import * as NEA from 'fp-ts/NonEmptyArray';
import * as H from 'helpers';
import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';

import Handle from 'view-elements/handle';

import Namespace from 'view-managers/handles/namespace';
import DataManager from 'view-managers/data';

class HandlesManager extends DataManager<Namespace.Props> implements Namespace.Interface {
  public readonly appendNodesTo = <Parent extends HTMLElement>(parent: Parent) => {
    pipe(this.handles, NEA.map(flow(H.prop('node'), H.appendTo(parent))));

    return (this);
  };

  public readonly moveTo = (coordinates: Namespace.Props['coordinates']) => {
    pipe(
      this.handles,
      NEA.zip(coordinates),
      NEA.map(([handle, coord]) => pipe(coord, this.percentOfRange, handle.moveTo))
    );

    this.mutateState({coordinates});

    return (this);
  };

  constructor(props: Namespace.Props) {
    super(props);

    this.state = {coordinates: props.coordinates} as Namespace.State;

    this.handles = this.renderHandles();
  }

  private state;

  private readonly handles;

  private readonly renderHandles = () => {
    const {orientation, bemBlockClassName, coordinates} = this.props;

    const getProps = (idx: number) => ({
      orientation,
      bemBlockClassName,
      onDrag: this.handleDrag(idx),
      onIncrease: this.handleChange('inc', idx),
      onDecrease: this.handleChange('dec', idx)
    });

    return (pipe(coordinates, NEA.mapWithIndex((idx, coord) => pipe(
      Handle, H.instance(getProps(idx)), H.method('moveTo', coord)
    ))));
  };

  private readonly handleDrag = (handleIdx: number) => ({x, y}: { x: number, y: number }) => {
    const {onChange, orientation} = this.props;
    const {coordinates} = this.state;

    const deltaCoord = pipe(orientation, H.switchCases([
      ['horizontal', pipe(x, this.pxToNum, F.constant)],
      ['vertical', pipe(y, this.pxToNum, F.constant)]
    ], F.constant(NaN)));

    pipe(
      coordinates,
      NEA.mapWithIndex((coordIdx, coord) => coordIdx === handleIdx ? H.add(deltaCoord)(coord) : coord),
      (xs) => onChange(xs as Namespace.Props['coordinates'])
    );
  };

  private readonly handleChange = (type: 'inc' | 'dec', handleIdx: number) => () => {
    const {step, onChange} = this.props;
    const {coordinates} = this.state;

    const changeAction = pipe(type, H.switchCases([
      ['inc', pipe(step, H.add, F.constant)],
      ['dec', pipe(step, H.sub, F.constant)]
    ], F.constant(H.ident as (x: number) => number)));

    pipe(
      coordinates,
      NEA.mapWithIndex((coordIdx, coord) => coordIdx === handleIdx ? changeAction(coord) : coord),
      (xs) => onChange(xs as Namespace.Props['coordinates'])
    );
  };

  private readonly mutateState = (state: Partial<Namespace.State>): Namespace.State => this.state = {...this.state, ...state};
}

export default HandlesManager;