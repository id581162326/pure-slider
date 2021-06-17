import * as O from 'fp-ts/Option';

import Element from '../element/namespace';
import Tooltip from '../tooltip/namespace';

namespace Handler {
  export type Node = HTMLDivElement;

  export type Tooltip = Tooltip.Interface;

  export type TooltipProps = Tooltip.Props;

  export type HandleType = 'start' | 'end';

  export type Currents = Element.Currents;

  export type Of = (props: Props) => Interface;

  export type MoveTo = (currents: Currents) => void;

  export type RenderTooltip = () => O.Option<Tooltip>;

  export type SetEventListeners = () => void;

  export type GetPos = (currents: Currents) => number;

  export type DragListener = (event: MouseEvent | TouchEvent) => void;

  export type StartDrag = (event: MouseEvent | TouchEvent) => void;

  export type EndDrag = (event: MouseEvent | TouchEvent) => void;

  export type OnDrag = (handleType: HandleType) => (delta: number) => void;

  export type Destroy = () => void;

  export type SetTabIndex = () => void;

  export type RemoveEventListeners = () => void;

  export type KeyDownListener = (event: KeyboardEvent) => void;

  export type GetTooltip = () => O.Option<Tooltip>;

  export interface Props extends Element.Props {
    type: HandleType,
    showTooltip: boolean,
    tooltipAlwaysShown: boolean,
    step: number,
    onDrag: OnDrag
  }

  export interface Interface extends Element.Interface {
    moveTo: MoveTo,
    getTooltip: GetTooltip
  }
}

export default Handler;