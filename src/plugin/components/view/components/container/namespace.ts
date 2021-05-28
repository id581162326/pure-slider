import Element from '../element/namespace';

namespace Container {
  export type Of = (o: Props) => Interface;

  export type Node = Element.Node;

  export interface Props extends Element.Props {}

  export interface Interface extends Element.Interface {}
}

export default Container;