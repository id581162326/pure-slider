import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as H from 'helpers';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as N from 'fp-ts/number';

import Base from 'view-elements/base';

import Namespace from 'view-managers/base/namespace';
import DataManager from 'view-managers/data';

class BaseManager extends DataManager<Namespace.Props> implements Namespace.Interface {
  public readonly appendNodeTo = <Parent extends HTMLElement>(parent: Parent) => {
    pipe(this.base.node, H.appendTo(parent));

    return (this);
  }

  constructor(props: Namespace.Props) {
    super(props);

    this.base = this.renderBase();
  }

  private readonly base;

  private readonly renderBase = () => {
    const {orientation, bemBlockClassName} = this.props;

    return (pipe(Base, H.instance({
      bemBlockClassName,
      orientation,
      onClick: this.handleClick
    })));
  };

  private readonly handleClick = ({x, y}: { x: number, y: number }) => {
    const {orientation, coordinates, onClick} = this.props;

    const clickCoord = pipe(orientation, H.switchCases([
      ['horizontal', pipe(x, this.pxToNum, this.correctToMin, F.constant)],
      ['vertical', pipe(y, this.pxToNum, this.correctToMin, F.constant)]
    ], F.constant(NaN)));

    const clickDistanceMap = pipe(coordinates, NEA.map(flow(H.sub(clickCoord), Math.abs)));

    const nearestDistance = pipe(clickDistanceMap, NEA.sort(N.Ord), NEA.head);

    pipe(
      coordinates,
      NEA.zip(clickDistanceMap),
      NEA.map(([coord, distance]) => distance === nearestDistance ? clickCoord : coord),
      (xs) => onClick(xs as Namespace.Props['coordinates'])
    );
  };
}

export default BaseManager;