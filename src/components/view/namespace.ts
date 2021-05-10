namespace View {
  interface Node {
    orientation: 'horizontal' | 'vertical',
    classList: string[]
  }

  export interface Connect extends Node {
    size: number,
    translate: number
  }

  export interface Handler extends Node {
    translate: number
  }

  export interface Tooltip extends Node {
    innerText: string
  }

  export interface ConnectMap {
    node: HTMLDivElement,
    id: number
  }

  export interface HandlerMap {
    node: HTMLDivElement,
    id: number
  }

  export type NodeKeys = 'connect' | 'handler' | 'tooltip' | 'base';

  export interface Props {
    container: HTMLElement,
    min: number,
    max: number,
    currents: number[],
    intervals: boolean[],
    orientation: 'vertical' | 'horizontal',
    tooltipOptions: {
      enabled: boolean,
      alwaysShown: boolean
    },
    customBlockClassName?: string,
    onDragHandler: (index: number, coordinate: number) => void
  }

  export interface Interface {
    props: Props,
    render: () => void,
    destroy: () => void,
    setProps: (newProps: Props) => void,
    updateCurrents: (newCurrents: Props['currents']) => void
  }
}

export default View;