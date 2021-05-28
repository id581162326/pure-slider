import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../helpers';

import Element from '../element';

import Namespace from './namespace';

class Connect extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Connect(props);

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {orientation} = this.props;

    const pos = this.getPos(currents);

    const size = this.getSize(currents);

    const style = orientation === 'horizontal'
      ? `left: ${pos}%; max-width: ${size}%;`
      : `bottom: ${pos}%; max-height: ${size}%;`;

    pipe(this.node, H.setInlineStyle(style));
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'connect');
  }

  private readonly getSize: Namespace.GetSize = (currents) => {
    const {range, type} = this.props;

    const max = pipe(range, NEA.last);

    const size = type === 'from-start'
      ? pipe(currents, NEA.head, this.correctToMin, this.percentOfRange)
      : type === 'to-end'
        ? pipe(currents, NEA.last, H.sub(max), H.abs, this.percentOfRange)
        : pipe(currents, H.subAdjacent(1), this.percentOfRange);

    return (size);
  };

  private readonly getPos: Namespace.GetPos = (currents) => {
    const {type} = this.props;

    const pos = type === 'to-end'
      ? pipe(currents, NEA.last, this.correctToMin, this.percentOfRange)
      : type === 'inner'
        ? pipe(currents, NEA.head, this.correctToMin, this.percentOfRange)
        : 0;

    return (pos);
  };
}

export default Connect;
