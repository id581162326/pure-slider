import Element from '../element/namespace';

namespace Unit {
  export type Node = HTMLDivElement;

  export type Of = (o: Props) => Interface;

  export type GetValue = () => number;

  export type SetActive = (bool: boolean) => void;

  export type PlaceNode = () => void;

  export interface Props extends Element.Props {
    value: number,
    withValue: boolean
  }

  export interface Interface extends Element.Interface {
    getValue: GetValue,
    setActive: SetActive,
    updatePosition: PlaceNode
  }
}

export default Unit;