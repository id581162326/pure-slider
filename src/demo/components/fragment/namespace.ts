import * as O from 'fp-ts/Option';

namespace Fragment {
  export type Parent = HTMLElement | DocumentFragment;

  export type Of = (props: Props) => (parent: Parent) => Interface;

  export type MapNode <Node extends HTMLElement> = (node: Node) => Node;

  export type Render<Node extends HTMLElement> = (map: MapNode<Node>) => void;

  export type ImportFragment = (x: HTMLTemplateElement) => DocumentFragment;

  export type RenderFragment = () => O.Option<DocumentFragment>;

  export interface Props {
    label: string
  }

  export interface Interface {
  }
}

export default Fragment;