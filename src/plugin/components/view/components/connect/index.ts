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

    if (orientation === 'horizontal') {
      pipe(this.node, H.setInlineStyle(`left: ${pos}%; max-width: ${size}%;`));
    }

    if (orientation === 'vertical') {
      pipe(this.node, H.setInlineStyle(`bottom: ${pos}%; max-height: ${size}%;`));
    }
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'connect');
  }

  private readonly getSize: Namespace.GetSize = (currents) => {
    const {range, type} = this.props;

    const max = pipe(range, NEA.last);

    if (type === 'from-start') {
      return (pipe(currents, NEA.head, this.correctToMin, this.percentOfRange));
    }

    if (type === 'to-end') {
      return (pipe(currents, NEA.last, H.sub(max), Math.abs, this.percentOfRange));
    }

    return (pipe(currents, H.subAdjacent(1), this.percentOfRange));
  };

  private readonly getPos: Namespace.GetPos = (currents) => {
    const {type} = this.props;

    if (type === 'to-end') {
      return (pipe(currents, NEA.last, this.correctToMin, this.percentOfRange));
    }

    if (type === 'inner') {
      return (pipe(currents, NEA.head, this.correctToMin, this.percentOfRange));
    }

    return (0);
  };
}

export default Connect;
