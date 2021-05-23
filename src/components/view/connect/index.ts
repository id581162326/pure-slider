import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import AbstractElement from '../abstract-element';

import Namespace from './namespace';

class Connect extends AbstractElement<Namespace.Props, Namespace.Node>{
  static readonly of: Namespace.Of = (props) => new Connect(props);

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {orientation} = this.props;

    const pos = this.getPos(currents);

    const size = this.getSize(currents);

    const style = orientation === 'horizontal'
      ? `left: ${pos}%; max-width: ${size}%;`
      : `top: ${pos}%; max-height: ${size}%;`;

    pipe(this.node, H.setInlineStyle(style));
  }

  protected readonly setClassList = () => {
    const {orientation, bemBlockClassName} = this.props;

    const {base, theme} = bemBlockClassName;

    pipe(this.node, H.addClassList([
      `${base}__connect`,
      `${base}__connect_orientation_${orientation}`,
      `${theme}__connect`,
      `${theme}__connect_orientation_${orientation}`,
    ]));
  }

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'));

    this.setClassList();
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
