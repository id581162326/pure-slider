import * as O from 'fp-ts/Option';

namespace Button {
  export type Parent = HTMLElement;

  export type Node = O.Option<HTMLElement>;

  export type Of = (o: Props) => (p: Parent) => Interface;

  export type RenderButton = () => O.Option<HTMLElement>;

  export type OnClick = (e: MouseEvent) => void

  export interface Props {
    label: string,
    onClick: OnClick
  }

  export interface Interface {
  }
}

export default Button;