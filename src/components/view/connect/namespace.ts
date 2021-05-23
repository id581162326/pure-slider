import AbstractElement from '../abstract-element/namespace';

namespace Connect {
  export type Node = HTMLDivElement;

  export type Type = 'from-start' | 'inner' | 'to-end';

  export type Currents = AbstractElement.Currents;

  export type Of = (o: Props) => Interface;

  export type MoveTo = (xs: Currents) => void;

  export type GetSize = (xs: Connect.Currents) => number;

  export type GetPos = (xs: Connect.Currents) => number;

  export interface Props extends AbstractElement.Props {
    type: Type
  }

  export interface Interface extends AbstractElement.Interface {
    moveTo: MoveTo
  }
}

export default Connect;