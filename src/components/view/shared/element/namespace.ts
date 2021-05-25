namespace Element {
  export type Node = HTMLElement;

  export type NodeKeys = 'base' | 'connect' | 'container' | 'handler' | 'tooltip' | 'scale' | 'unit';

  export type Orientation = 'horizontal' | 'vertical';

  export type Currents = [number] | [number, number];

  export type Range = [number, number];

  export type GetNode<Node> = () => Node;

  export type Destroy = () => void;

  export type SetClassList = () => void;

  export type PxToNum = (x: number) => number;

  export type CorrectToMin = (x: number) => number;

  export type PercentOfRange = (x: number) => number;

  export type NodeSize = <Node extends HTMLElement>(n: Node) => number;

  export type ToggleOrientation = () => void

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
    toggleOrientation: ToggleOrientation
  }
}

export default Element;