import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Element from '../shared/element';
import Tooltip from '../shared/tooltip';

import Namespace from './namespace';

class Handler extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Handler(props);

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const {orientation, showTooltip, type} = this.props;

    const pos = this.getPos(currents);

    const offset = pipe(this.node, this.nodeSize, H.half);

    const style = orientation === 'horizontal'
      ? `left: calc(${pos}% - ${offset}px);`
      : `bottom: calc(${pos}% - ${offset}px);`;

    if (showTooltip && this.tooltip) {
      const value = pipe(currents, type === 'start' || type === 'single' ? NEA.head : NEA.last);

      this.tooltip.setValue(value);
    }

    pipe(this.node, H.setInlineStyle(style));
  };

  public readonly getTooltip: Namespace.GetTooltip = () => this.tooltip;

  public readonly toggleTooltip: Namespace.ToggleTooltip = () => {
    if (this.tooltip) {
      const tooltipNode = this.tooltip.getNode();

      tooltipNode.parentNode ? this.tooltip.destroy() : H.appendTo(this.node)(tooltipNode);
    }
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'handler');

    if (props.showTooltip) {
      this.tooltip = this.renderTooltip();
    }

    if (this.tooltip) {
      const tooltipNode = this.tooltip.getNode();

      pipe(tooltipNode, H.appendTo(this.node));
    }

    this.setEventListeners();
    this.setTabIndex();
  }

  private readonly tooltip: Namespace.Tooltip = null;

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

  private readonly setTabIndex: () => void = () => {
    this.node.tabIndex = 0;
  };

  private readonly setEventListeners: Namespace.SetEventListeners = () => {
    H.addEventListener('mousedown', this.startDrag)(this.node);
    H.addEventListener('keydown', this.keyDownListener)(this.node);
    H.addEventListener('mouseup', this.endDrag)(window);
  };

  private readonly getPos: Namespace.GetPos = (currents) => {
    const {type} = this.props;

    const pos = pipe(currents, type === 'start' || type === 'single'
      ? NEA.head
      : NEA.last, this.correctToMin, this.percentOfRange);

    return (pos);
  };

  private readonly dragListener: Namespace.DragListener = (event) => {
    const {onChange, orientation, type} = this.props;

    const coordKey = orientation === 'horizontal' ? 'x' : 'y';

    const offset = pipe(this.node, this.nodeSize, H.half);

    const bouncingClientRect = pipe(this.node.getBoundingClientRect(), H.prop(coordKey));

    pipe(event, H.prop(coordKey), H.sub(bouncingClientRect), orientation === 'horizontal'
      ? H.ident
      : H.negate, H.sub(offset), this.pxToNum, onChange(type));
  };

  private readonly startDrag: Namespace.StartDrag = () => {
    H.addEventListener('mousemove', this.dragListener)(window);
  };

  private readonly endDrag: Namespace.EndDrag = () => {
    H.removeEventListener('mousemove', this.dragListener)(window);
  };

  private readonly keyDownListener: (e: KeyboardEvent) => void = ({code}) => {
    const {type, step, orientation, onChange} = this.props;

    const decCond = (orientation === 'horizontal' && code === 'ArrowLeft')
      || (orientation === 'vertical' && code === 'ArrowDown')
      || code === 'Minus';

    const incCond = (orientation === 'horizontal' && code === 'ArrowRight')
      || (orientation === 'vertical' && code === 'ArrowUp')
      || code === 'Equal';

    decCond ? onChange(type)(H.negate(step)) : incCond ? onChange(type)(step) : false;
  };
}

export default Handler;

