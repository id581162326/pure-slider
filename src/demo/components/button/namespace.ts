import * as O from 'fp-ts/Option';

namespace Button {
  export type Parent = HTMLElement | DocumentFragment;

  export type MapButton = (buttonNode: HTMLButtonElement) => HTMLButtonElement;

  export type Node = O.Option<HTMLElement>;

  export type Of = (props: Props) => <T extends Parent>(parent: T) => Interface;

  export type OnClick = (event: MouseEvent) => void;

  export interface Props {
    label: string,
    onClick: OnClick
  }

  export interface Interface {
  }
}

export default Button;