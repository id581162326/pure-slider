import Element from '../shared/element/namespace';
import Tooltip from '../shared/tooltip/namespace';

namespace Handler {
  export type Node = HTMLDivElement;

  export type Tooltip = Tooltip.Interface | null;

  export type TooltipProps = Tooltip.Props;

  export type Type = 'start' | 'end' | 'single';

  export type Currents = Element.Currents;

  export type Of = (o: Props) => Interface;

  export type MoveTo = (xs: Currents) => void;

  export type ToggleTooltip = () => void;

  export type RenderTooltip = () => Tooltip;

  export type SetEventListeners = () => void;

  export type GetPos = (xs: Currents) => number;

  export type GetTooltip = () => Tooltip | null;

  export type DragListener = (e: MouseEvent) => void;

  export type StartDrag = () => void;

  export type EndDrag = () => void;

  export type OnChange = (t: Type) => (x: number) => void

  export interface Props extends Element.Props {
    type: Type,
    showTooltip: boolean,
    tooltipAlwaysShown: boolean,
    step: number,
    onChange: OnChange
  }

  export interface Interface extends Element.Interface {
    moveTo: MoveTo,
    toggleTooltip: ToggleTooltip;
    getTooltip: GetTooltip
  }
}

export default Handler;