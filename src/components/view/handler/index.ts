import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import AbstractElement from '../abstract-element';

import Namespace from './namespace';

class Handler extends AbstractElement<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Handler(props);

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {orientation} = this.props;

    const pos = this.getPos(currents);

    const offset = pipe(this.node, this.nodeSize, H.half);

    const style = orientation === 'horizontal'
      ? `left: calc(${pos}% - ${offset}px);`
      : `top: calc(${pos}% - ${offset}px);`;

    pipe(this.node, H.setInlineStyle(style));
  }

  protected readonly setClassList = () => {
    const {orientation, bemBlockClassName} = this.props;

    const {base, theme} = bemBlockClassName;

    pipe(this.node, H.addClassList([
      `${base}__handler`,
      `${base}__handler_orientation_${orientation}`,
      `${theme}__handler`,
      `${theme}__handler_orientation_${orientation}`,
    ]));
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'));

    this.setClassList();
    this.setEventListeners();
  }

  private readonly setEventListeners: Namespace.SetEventListeners = () => {
    H.addEventListener('mousedown', this.startDrag)(this.node);
    H.addEventListener('mouseup', this.endDrag)(window);
  };

  private readonly getPos: Namespace.GetPos = (currents) => {
    const {type} = this.props;

    const pos = pipe(currents, type === 'start' || type === 'single' ? NEA.head : NEA.last, this.correctToMin, this.percentOfRange);

    return (pos);
  };

  private readonly dragListener: Namespace.DragListener = (event) => {
    const {onDrag, orientation, type} = this.props;

    const coordKey = orientation === 'horizontal' ? 'x' : 'y';

    const offset = pipe(this.node, this.nodeSize, H.half);

    pipe(event[coordKey], H.sub(this.node.getBoundingClientRect()[coordKey]), H.sub(offset), this.pxToNum, onDrag(type));
  };

  private readonly startDrag: Namespace.StartDrag = () => {
    H.addEventListener('mousemove', this.dragListener)(window);
  }

  private readonly endDrag: Namespace.EndDrag = () => {
    H.removeEventListener('mousemove', this.dragListener)(window);
  }
}

export default Handler;

