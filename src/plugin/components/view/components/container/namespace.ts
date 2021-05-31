import Element from '../element/namespace';

namespace Container {
  export type Of = (props: Props) => Interface;

  export type Node = Element.Node;

  export interface Props extends Element.Props {}

  export interface Interface extends Element.Interface {}
}

export default Container;