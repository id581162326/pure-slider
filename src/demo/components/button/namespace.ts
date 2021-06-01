import * as O from 'fp-ts/Option';

namespace Button {
  export type Parent = HTMLElement | DocumentFragment;

  export type Node = O.Option<HTMLElement>;

  export type Of = (o: Props) => <T extends Parent>(p: T) => Interface;

  export type OnClick = (e: MouseEvent) => void

  export interface Props {
    label: string,
    onClick: OnClick
  }

  export interface Interface {
  }
}

export default Button;