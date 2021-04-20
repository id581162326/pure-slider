namespace View {
  interface Classes {
    base?: string,
    connect?: string,
    handler?: string,
    origin?: string,
    tooltip?: string,
    scale?: string
  }
  
  export type NodeKeys = 'tooltip' | 'handler' | 'origin' | 'connect' | 'base' | 'scale';
  
  export interface Nodes {
    connects: HTMLDivElement[],
    handlers: HTMLDivElement[],
    tooltips: HTMLDivElement[]
    base: HTMLDivElement
  }
  
  export interface Props {
    container: HTMLDivElement,
    min: number,
    max: number,
    currents: number[],
    intervals: boolean[],
    orientation: 'vertical' | 'horizontal',
    scale: {
      enabled: boolean,
      measure: number
    },
    tooltip: {
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
    setProps: (props: Props) => void,
    moveSlider: (currents: Props['currents']) => void
  }
}

export default View;