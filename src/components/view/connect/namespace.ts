import Element from '../shared/element/namespace';

namespace Connect {
  export type Node = HTMLDivElement;

  export type Type = 'from-start' | 'inner' | 'to-end';

  export type Currents = Element.Currents;

  export type Of = (o: Props) => Interface;

  export type MoveTo = (xs: Currents) => void;

  export type GetSize = (xs: Connect.Currents) => number;

  export type GetPos = (xs: Connect.Currents) => number;

  export interface Props extends Element.Props {
    type: Type
  }

  export interface Interface extends Element.Interface {
    moveTo: MoveTo
  }
}

export default Connect;