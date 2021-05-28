import * as O from 'fp-ts/Option';

namespace Fragment {
  export type Parent = HTMLElement;

  export type Of = (o: Props) => (p: Parent) => Interface;

  export type RenderFragment = () => O.Option<DocumentFragment>;

  export type OnClick = (e: MouseEvent) => void

  export interface Props {
    label: string,
    onClick: OnClick
  }

  export interface Interface {
  }
}

export default Fragment;