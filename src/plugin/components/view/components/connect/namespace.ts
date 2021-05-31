import Element from '../element/namespace';

namespace Connect {
  export type Node = HTMLDivElement;

  export type Type = 'from-start' | 'inner' | 'to-end';

  export type Currents = Element.Currents;

  export type Of = (props: Props) => Interface;

  export type MoveTo = (currents: Currents) => void;

  export type GetSize = (currents: Connect.Currents) => number;

  export type GetPos = (currents: Connect.Currents) => number;

  export interface Props extends Element.Props {
    type: Type
  }

  export interface Interface extends Element.Interface {
    moveTo: MoveTo
  }
}

export default Connect;