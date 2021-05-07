namespace View {
  interface Classes {
    base?: string,
    connect?: string,
    handler?: string,
    origin?: string,
    tooltip?: string,
    scale?: string
  }

  export type Connect = HTMLDivElement;

  export type Handler = HTMLDivElement;

  export type Tooltip = HTMLSpanElement;

  export type Base = HTMLDivElement;

  export type NodeTypes = Connect | Handler | Tooltip | Base;
  
  export interface Nodes {
    connects: Connect[],
    handlers: Handler[],
    tooltips: Tooltip[]
    base: Base
  }

  export type NodeKeys = 'tooltip' | 'handler' | 'origin' | 'connect' | 'base' | 'scale';
  
  export interface Props {
    container: HTMLDivElement,
    min: number,
    max: number,
    currents: number[],
    intervals: boolean[],
    orientation: 'vertical' | 'horizontal',
    scaleOptions: {
      enabled: boolean,
      measure: number
    },
    tooltipOptions: {
      enabled: boolean,
      alwaysShown: boolean,
      prefix: string,
      postfix: string
    },
    classes: Classes
  }
  
  export interface Interface {
    props: Props,
    nodes: Nodes,
    render: () => void,
    destroy: () => void,
    setProps: (newProps: Props) => void,
    updateSlider: (newCurrents: Props['currents']) => void
  }
}

export default View;