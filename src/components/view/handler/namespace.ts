import AbstractElement from '../abstract-element/namespace';

namespace Handler {
  export type Node = HTMLDivElement;

  export type Type = 'start' | 'end' | 'single';

  export type Currents = AbstractElement.Currents;

  export type Of = (o: Props) => Interface;

  export type MoveTo = (xs: Currents) => void;

  export type SetEventListeners = () => void;

  export type GetPos = (xs: Currents) => number;

  export type DragListener = (e: MouseEvent) => void;

  export type StartDrag = () => void;

  export type EndDrag = () => void;

  export type OnDrag = (type: Type) => (coord: number) => void

  export interface Props extends AbstractElement.Props{
    type: Type,
    onDrag: OnDrag
  }

  export interface Interface extends AbstractElement.Interface {
    moveTo: MoveTo
  }
}

export default Handler;