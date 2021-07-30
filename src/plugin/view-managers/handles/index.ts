import * as NEA from 'fp-ts/NonEmptyArray';
import * as H from 'helpers';
import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';

import Handle from 'view-elements/handle';
import Tooltip from 'view-elements/tooltip';

import ComponentManager from 'view-managers/component';

import Namespace from './namespace';

class HandlesManager extends ComponentManager<Namespace.Props> implements Namespace.Interface {
  public readonly appendNodesTo = <Parent extends HTMLElement>(parent: Parent) => {
    pipe(this.handles, NEA.map(flow(H.prop('node'), H.appendTo(parent))));

    return (this);
  };

  public readonly moveTo = (coordinates: Namespace.Props['coordinates']) => {
    this.updateHandlesPos(coordinates);
    this.updateTooltipsValue(coordinates);

    this.mutateState({coordinates});

    return (this);
  };

  constructor(props: Namespace.Props) {
    super(props);

    this.state = {coordinates: props.coordinates} as Namespace.State;

    this.handles = this.renderHandles();

    this.tooltips = this.renderTooltips();
  }

  private state;

  private readonly handles;

  private readonly tooltips;

  private readonly renderHandles = () => {
    const {orientation, bemBlockClassName, coordinates} = this.props;

    return (pipe(
      coordinates,
      NEA.map(this.percentOfRange),
      NEA.mapWithIndex((idx, pos) => pipe(Handle, H.instance({
        orientation,
        bemBlockClassName,
        onDrag: this.handleDrag(idx),
        onIncrease: this.handleChange('inc', idx),
        onDecrease: this.handleChange('dec', idx)
      }), H.method('moveTo', pos)))
    ));
  };

  private readonly renderTooltips = () => {
    const {orientation, bemBlockClassName, coordinates, tooltipsEnabled, tooltipsAlwaysShown} = this.props;

    return (tooltipsEnabled ? pipe(
      coordinates,
      NEA.map((_) => pipe(Tooltip, H.instance({
        orientation,
        bemBlockClassName,
        alwaysShown: Boolean(tooltipsAlwaysShown)
      }))),
      NEA.zip(this.handles),
      NEA.map(([tooltip, handle]) => {
        H.appendTo(handle.node)(tooltip.node);

        return (tooltip);
      }), O.some
    ) : O.none);
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

  private readonly updateHandlesPos = (coordinates: Namespace.Props['coordinates']) => pipe(
    this.handles,
    NEA.zip(coordinates),
    NEA.map(([handle, coord]) => pipe(coord, this.percentOfRange, handle.moveTo))
  );

  private readonly updateTooltipsValue = (coordinates: Namespace.Props['coordinates']) => pipe(
    this.tooltips,
    O.map(flow(
      NEA.zip(coordinates),
      NEA.map(([tooltip, coord]) => pipe(coord, tooltip.setValue))
    ))
  );

  private readonly mutateState = (state: Partial<Namespace.State>): Namespace.State => this.state = {...this.state, ...state};
}

export default HandlesManager;