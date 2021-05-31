import Element from '../element/namespace';

namespace Unit {
  export type Node = HTMLDivElement;

  export type Of = (props: Props) => Interface;

  export type GetValue = () => number;

  export type SetActive = (active: boolean) => void;

  export type PlaceNode = () => void;

  export type OnClick = (coord: number) => void

  export interface Props extends Element.Props {
    value: number,
    withValue: boolean,
    onClick: OnClick
  }

  export interface Interface extends Element.Interface {
    getValue: GetValue,
    setActive: SetActive,
    updatePosition: PlaceNode
  }
}

export default Unit;