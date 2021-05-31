namespace Element {
  export type Node = HTMLElement;

  export type NodeKeys = 'base' | 'connect' | 'container' | 'handler' | 'tooltip' | 'scale' | 'unit';

  export type Orientation = 'horizontal' | 'vertical';

  export type Currents = [number] | [number, number];

  export type Range = [number, number];

  export type GetNode<Node> = () => Node;

  export type Destroy = () => void;

  export type SetClassList = () => void;

  export type PxToNum = (px: number) => number;

  export type CorrectToMin = (coord: number) => number;

  export type PercentOfRange = (coord: number) => number;

  export type NodeSize = <Node extends HTMLElement>(node: Node) => number;

  export type BemBlockClassName = {
    base: string,
    theme: string
  }

  export interface Props {
    container: HTMLElement,
    orientation: Orientation,
    range: Range,
    bemBlockClassName: BemBlockClassName
  }

  export interface Interface {
    getNode: GetNode<Node>,
    destroy: Destroy
  }
}

export default Element;