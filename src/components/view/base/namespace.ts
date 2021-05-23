import AbstractElement from '../abstract-element/namespace';

namespace Base {
  export type Node = HTMLDivElement;

  export type Of = (o: Props) => Interface;

  export type OnClick = (coord: number) => void;

  export interface Props extends AbstractElement.Props{
    onClick: OnClick
  }

  export interface Interface extends AbstractElement.Interface {}
}

export default Base;