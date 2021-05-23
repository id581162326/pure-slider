import AbstractElement from '../abstract-element/namespace';

namespace Tooltip {
  export type Node = HTMLSpanElement;

  export type Type = 'start' | 'end' | 'single';

  export type Currents = AbstractElement.Currents;

  export type Of = (o: Props) => Interface;

  export type MoveTo = (xs: Currents) => void;

  export type GetValue = (xs: Currents) => string;

  export interface Props extends AbstractElement.Props{
    type: Type,
    alwaysShown: boolean
  }

  export interface Interface extends AbstractElement.Interface {
    moveTo: (currents: Currents) => void
  }
}

export default Tooltip;