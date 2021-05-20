namespace V {
  export interface NodeMap {
    id: number,
    node: HTMLDivElement | HTMLSpanElement
  }

  export interface UpdateHandlersPosition {
    type: 'UPDATE_HANDLERS_POSITION',
    currents: number[]
  }

  export interface SetOrientation {
    type: 'SET_ORIENTATION',
    orientation: 'horizontal' | 'vertical'
  }

  export type Action = UpdateHandlersPosition | SetOrientation;

  export type NodeKeys = 'connect' | 'handler' | 'tooltip' | 'base';

  export interface EventListenersStore  {
    startDragListener: ((e: MouseEvent) => any)[],
    stopDragListener: ((e: MouseEvent) => any)[]
  }

  export interface Props {
    container: HTMLElement,
    min: number,
    max: number,
    intervals: boolean[],
    tooltipOptions: {
      enabled: boolean,
      alwaysShown?: boolean
    },
    bemBlockClassName?: string,
    onChange: (currents: number[]) => void
  }

  export interface State {
    currents: number[],
    orientation: 'vertical' | 'horizontal'
  }

  export interface Interface {
    props: Props,
    state: State,
    render: () => void,
    destroy: () => void,
    setProps: (props: Props) => void,
    setState: (state: State) => void,
    updateState: (action: Action) => void
  }
}

export default V;