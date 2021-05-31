import Element from '../element/namespace';
import Tooltip from '../tooltip/namespace';

namespace Handler {
  export type Node = HTMLDivElement;

  export type Tooltip = Tooltip.Interface;

  export type TooltipProps = Tooltip.Props;

  export type HandleType = 'start' | 'end' | 'single';

  export type Currents = Element.Currents;

  export type Of = (props: Props) => Interface;

  export type MoveTo = (currents: Currents) => void;

  export type RenderTooltip = () => Tooltip;

  export type SetEventListeners = () => void;

  export type GetPos = (currents: Currents) => number;

  export type AppendTooltip = () => void;

  export type DragListener = (event: MouseEvent | TouchEvent) => void;

  export type StartDrag = (event: MouseEvent | TouchEvent) => void;

  export type EndDrag = (event: MouseEvent | TouchEvent) => void;

  export type OnDrag = (handleType: HandleType) => (delta: number) => void

  export interface Props extends Element.Props {
    type: HandleType,
    showTooltip: boolean,
    tooltipAlwaysShown: boolean,
    step: number,
    onDrag: OnDrag
  }

  export interface Interface extends Element.Interface {
    moveTo: MoveTo
  }
}

export default Handler;