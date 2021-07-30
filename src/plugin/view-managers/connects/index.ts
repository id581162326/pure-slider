import * as H from 'helpers';
import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';

import Connect from 'view-elements/connect';

import ComponentManager from 'view-managers/component';

import Namespace from './namespace';

class ConnectsManager extends ComponentManager<Namespace.Props> implements Namespace.Interface {
  public readonly appendNodesTo = <Parent extends HTMLElement>(parent: Parent) => {
    pipe(this.connects, A.map(flow(H.prop('node'), H.appendTo(parent))));

    return (this);
  };

  public readonly moveTo = (coordinates: Namespace.Props['coordinates']) => {
    this.updateConnectsSizeAndPos(coordinates);

    return (this);
  };

  constructor(props: Namespace.Props) {
    super(props);

    this.connects = this.renderConnects();
  }

  private readonly connects;

  private readonly renderConnects = () => {
    const {bemBlockClassName, orientation, coordinates} = this.props;

    const dimensionsMap = this.getDimensionsMap(coordinates);

    return (pipe(
      dimensionsMap,
      A.map(([pos, size]) => pipe(
        Connect, H.instance({orientation, bemBlockClassName}),
        H.method('moveTo', pos), H.method('sizeTo', size)
      ))
    ));
  };

  private readonly getDimensionsMap = (coordinates: Namespace.Props['coordinates']) => [
    this.getPositionMap(coordinates), this.getSizeMap(coordinates)
  ];

  private readonly getTypeMap = () => {
    const {connectType} = this.props;

    return (pipe(connectType, H.switchCases([
      ['from-start', F.constant(['from-start'])],
      ['to-end', F.constant(['to-end'])],
      ['inner-range', F.constant(['inner'])],
      ['outer-range', F.constant(['from-start', 'to-end'])]
    ], F.constant([] as Namespace.ConnectType))) as Namespace.ConnectType);
  };

  private readonly getPositionMap = (coordinates: Namespace.Props['coordinates']) => pipe(
    this.getTypeMap(),
    A.map((type) => pipe(type, H.switchCases([
      ['from-start', () => pipe(coordinates, NEA.head, this.percentOfRange)],
      ['to-end', () => pipe(coordinates, NEA.last, this.percentOfRange)],
      ['inner', () => pipe(coordinates, NEA.head, this.percentOfRange)]
    ], F.constant(NaN))))
  );

  private readonly getSizeMap = (coordinates: Namespace.Props['coordinates']) => pipe(
    this.getTypeMap(),
    A.map((type) => pipe(type, H.switchCases([
      ['from-start', () => pipe(coordinates, NEA.head, pipe(this.props.range, NEA.head, H.sub), this.percentOfRange)],
      ['to-end', () => pipe(this.props.range, NEA.last, pipe(coordinates, NEA.last, H.sub), this.percentOfRange)],
      ['inner', () => pipe(coordinates, H.subAdjacent(1), this.percentOfRange)]
    ], F.constant(NaN))))
  );


  private readonly updateConnectsSizeAndPos = (coordinates: Namespace.Props['coordinates']) => {
    const dimensionsMap = this.getDimensionsMap(coordinates);

    pipe(this.connects, A.zip(dimensionsMap), A.map(([connect, [pos, size]]) => pipe(
      connect, H.method('moveTo', pos), H.method('sizeTo', size)
    )));
  };
}

export default ConnectsManager;