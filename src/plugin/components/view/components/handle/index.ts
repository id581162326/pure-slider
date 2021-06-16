import * as NEA from 'fp-ts/NonEmptyArray';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../helpers';

import Element from '../element';
import Tooltip from '../tooltip';

import Namespace from './namespace';

class Handle extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Handle(props);

  public readonly getTooltip: Namespace.GetTooltip = () => this.tooltip;

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {orientation, type} = this.props;

    const pos = this.getPos(currents);
    const offset = pipe(this.node, this.nodeSize, H.half);

    if (orientation === 'horizontal') {
      pipe(this.node, H.setInlineStyle(`left: calc(${pos}% - ${offset}px);`));
    }

    if (orientation === 'vertical') {
      pipe(this.node, H.setInlineStyle(`bottom: calc(${pos}% - ${offset}px);`));
    }

    pipe(this.tooltip, O.fromNullable, O.some, O.map((x) => {
      if (O.isSome(x)) {
        pipe(currents, type === 'start' ? NEA.head : NEA.last, pipe(x, H.prop('value'), H.prop('setValue')));
      }
    }));
  };

  public readonly destroy: Namespace.Destroy = () => {
    this.node.remove();

    this.removeEventListeners();
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'handle');

    this.tooltip = props.showTooltip ? this.renderTooltip() : null;

    this.setEventListeners();
    this.setTabIndex();
  }

  private readonly tooltip: Namespace.Tooltip;

  private readonly renderTooltip: Namespace.RenderTooltip = () => {
    const {range, container, orientation, bemBlockClassName, tooltipAlwaysShown} = this.props;

    const tooltipProps: Namespace.TooltipProps = {
      range, container, orientation, bemBlockClassName,
      alwaysShown: tooltipAlwaysShown
    };


    return (pipe(tooltipProps, Tooltip.of, (x) => {
      pipe(x.getNode(), H.appendTo(this.node));

      return (x);
    }));
  };

  private readonly setTabIndex: Namespace.SetTabIndex = () => {
    this.node.tabIndex = 0;
  };

  private readonly setEventListeners: Namespace.SetEventListeners = () => {
    A.map((eventType: 'pointerdown' | 'mousedown') => H.addEventListener(
      eventType, this.startDrag
    )(this.node))(['pointerdown', 'mousedown']);

    A.map((eventType: 'pointerup' | 'mouseup') => H.addEventListener(
      eventType, this.endDrag
    )(window))(['pointerup', 'mouseup']);

    H.addEventListener('keydown', this.keyDownListener)(this.node);
  };

  private readonly removeEventListeners: Namespace.RemoveEventListeners = () => {
    A.map((eventType: 'pointerup' | 'mouseup') => H.removeEventListener(
      eventType, this.endDrag
    )(window))(['pointerup', 'mouseup']);
  };

  private readonly getPos: Namespace.GetPos = (currents) => {
    const {type} = this.props;

    if (type === 'start') {
      return (pipe(currents, NEA.head, this.correctToMin, this.percentOfRange));
    }

    return (pipe(currents, NEA.last, this.correctToMin, this.percentOfRange));
  };

  private readonly dragListener: Namespace.DragListener = (event) => {
    const {onDrag, orientation, type} = this.props;

    const offset = pipe(this.node, this.nodeSize, H.half);

    if (orientation === 'horizontal') {
      const bouncingClientRect = this.node.getBoundingClientRect().x;

      const location = event.type === 'touchmove'
        ? pipe(event as TouchEvent, H.prop('targetTouches'), H.prop(0), H.prop('clientX'))
        : pipe(event as MouseEvent, H.prop('x'));

      pipe(location, H.sub(bouncingClientRect), H.sub(offset), this.pxToNum, onDrag(type));
    }

    if (orientation === 'vertical') {
      const bouncingClientRect = this.node.getBoundingClientRect().y;

      const location = event.type === 'touchmove'
        ? pipe(event as TouchEvent, H.prop('targetTouches'), H.prop(0), H.prop('clientY'))
        : pipe(event as MouseEvent, H.prop('y'));

      pipe(location, H.sub(bouncingClientRect), H.negate, H.sub(offset), this.pxToNum, onDrag(type));
    }
  };

  private readonly startDrag: Namespace.StartDrag = (event) => {
    event.stopPropagation();

    H.addEventListener('touchmove', this.dragListener)(window);
    H.addEventListener('mousemove', this.dragListener)(window);
  };

  private readonly endDrag: Namespace.EndDrag = (event) => {
    event.stopPropagation();

    H.removeEventListener('touchmove', this.dragListener)(window);
    H.removeEventListener('mousemove', this.dragListener)(window);
  };

  private readonly keyDownListener: Namespace.KeyDownListener = (event) => {
    const {code} = event;
    const {type, step, orientation, onDrag} = this.props;

    const decCond = (orientation === 'horizontal' && code === 'ArrowLeft')
      || (orientation === 'vertical' && code === 'ArrowDown')
      || code === 'Minus';

    const incCond = (orientation === 'horizontal' && code === 'ArrowRight')
      || (orientation === 'vertical' && code === 'ArrowUp')
      || code === 'Equal';


    if (decCond || incCond) {
      event.preventDefault();
    }

    decCond ? onDrag(type)(H.negate(step)) : incCond ? onDrag(type)(step) : false;
  };
}

export default Handle;

