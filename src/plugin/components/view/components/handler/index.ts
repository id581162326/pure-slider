import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../helpers';

import Element from '../element';
import Tooltip from '../tooltip';

import Namespace from './namespace';

class Handler extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Handler(props);

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {orientation, type} = this.props;

    const pos = this.getPos(currents);

    const offset = pipe(this.node, this.nodeSize, H.half);

    const style = orientation === 'horizontal'
      ? `left: calc(${pos}% - ${offset}px);`
      : `bottom: calc(${pos}% - ${offset}px);`;

    const value = pipe(currents, type === 'start' || type === 'single' ? NEA.head : NEA.last);

    this.tooltip.setValue(value);

    pipe(this.node, H.setInlineStyle(style));
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'handler');

    this.tooltip = this.renderTooltip();

    props.showTooltip ? this.appendTooltip() : this.tooltip.destroy();

    this.setEventListeners();
    this.setTabIndex();
  }

  private readonly tooltip: Namespace.Tooltip;

  private readonly renderTooltip: Namespace.RenderTooltip = () => {
    const {range, container, orientation, bemBlockClassName, tooltipAlwaysShown} = this.props;

    const ofTooltip = pipe(Tooltip, H.prop('of'));

    const tooltipProps: Namespace.TooltipProps = {
      range,
      container,
      orientation,
      bemBlockClassName,
      alwaysShown: tooltipAlwaysShown
    };

    return (pipe(tooltipProps, ofTooltip));
  };

  private appendTooltip: Namespace.AppendTooltip = () => {
    const tooltipNode = this.tooltip.getNode();

    pipe(tooltipNode, H.appendTo(this.node));
  }

  private readonly setTabIndex: () => void = () => {
    this.node.tabIndex = 0;
  };

  private readonly setEventListeners: Namespace.SetEventListeners = () => {
    H.addEventListener('pointerdown', this.startDrag)(this.node);
    H.addEventListener('mousedown', this.startDrag)(this.node);
    H.addEventListener('pointerup', this.endDrag)(window);
    H.addEventListener('mouseup', this.endDrag)(window);
    H.addEventListener('keydown', this.keyDownListener)(this.node);
  };

  private readonly getPos: Namespace.GetPos = (currents) => {
    const {type} = this.props;

    const pos = pipe(currents, type === 'start' || type === 'single'
      ? NEA.head
      : NEA.last, this.correctToMin, this.percentOfRange);

    return (pos);
  };

  private readonly dragListener: Namespace.DragListener = (event) => {
    const {onDrag, orientation, type} = this.props;

    const xOrY = orientation === 'horizontal' ? 'x' : 'y';

    const clientXorY = orientation === 'horizontal' ? 'clientX' : 'clientY';

    const offset = pipe(this.node, this.nodeSize, H.half);

    const bouncingClientRect = pipe(this.node.getBoundingClientRect(), H.prop(xOrY));

    const location = event.type === 'touchmove'
      ? pipe(event as TouchEvent, H.prop('targetTouches'))[0][clientXorY]
      : pipe(event as MouseEvent, H.prop(xOrY));

    pipe(location, H.sub(bouncingClientRect), orientation === 'horizontal'
      ? H.ident
      : H.negate, H.sub(offset), this.pxToNum, onDrag(type));
  };

  private readonly startDrag: Namespace.StartDrag = () => {
    H.addEventListener('touchmove', this.dragListener)(window);
    H.addEventListener('mousemove', this.dragListener)(window);
  };

  private readonly endDrag: Namespace.EndDrag = () => {
    H.removeEventListener('touchmove', this.dragListener)(window);
    H.removeEventListener('mousemove', this.dragListener)(window);
  };

  private readonly keyDownListener: (e: KeyboardEvent) => void = ({code}) => {
    const {type, step, orientation, onDrag} = this.props;

    const decCond = (orientation === 'horizontal' && code === 'ArrowLeft')
      || (orientation === 'vertical' && code === 'ArrowDown')
      || code === 'Minus';

    const incCond = (orientation === 'horizontal' && code === 'ArrowRight')
      || (orientation === 'vertical' && code === 'ArrowUp')
      || code === 'Equal';

    decCond ? onDrag(type)(H.negate(step)) : incCond ? onDrag(type)(step) : false;
  };
}

export default Handler;

