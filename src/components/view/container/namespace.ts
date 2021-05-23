import AbstractElement from '../abstract-element/namespace';

namespace Container {
  export type Of = (o: Props) => Interface;

  export type Node = AbstractElement.Node;

  export interface Props extends AbstractElement.Props {}

  export interface Interface extends AbstractElement.Interface {}
}

export default Container;