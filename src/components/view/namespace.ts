namespace View {
  export interface NodeMap {
    id: number,
    node: HTMLDivElement | HTMLSpanElement
  }

  export type NodeKeys = 'connect' | 'handler' | 'tooltip' | 'base';

  export interface ListenersStore  {
    startDragListener: ((e: MouseEvent) => any)[],
    stopDragListener: ((e: MouseEvent) => any)[]
  }

  export interface Props {
    container: HTMLElement,
    min: number,
    max: number,
    currents: number[],
    intervals: boolean[],
    orientation: 'vertical' | 'horizontal',
    tooltipOptions: {
      enabled: boolean,
      alwaysShown?: boolean
    },
    bemBlockClassName?: string,
    onDragHandler: (index: number, coord: number) => void
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