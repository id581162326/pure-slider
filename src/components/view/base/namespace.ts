import Element from '../shared/element/namespace';

namespace Base {
  export type Node = HTMLDivElement;

  export type Of = (o: Props) => Interface;

  export type OnClick = (coord: number) => void;

  export interface Props extends Element.Props{
    onClick: OnClick
  }

  export interface Interface extends Element.Interface {}
}

export default Base;