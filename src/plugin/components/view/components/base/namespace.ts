import Element from '../element/namespace';

namespace Base {
  export type Node = HTMLDivElement;

  export type Of = (props: Props) => Interface;

  export type SetEventListeners = () => void;

  export type ClickListener = (event: MouseEvent) => void;

  export type OnClick = (coordinate: number) => void;

  export interface Props extends Element.Props {
    onClick: OnClick
  }

  export interface Interface extends Element.Interface {
  }
}

export default Base;