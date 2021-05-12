namespace View {
  export interface NodeMap {
    id: number,
    node: HTMLDivElement | HTMLSpanElement
  }

  export interface CurrentsUpdated {
    type: 'UPDATE_HANDLERS_POSITION',
    currents: State['currents']
  }

  export type StateActions = CurrentsUpdated;

  export type NodeKeys = 'connect' | 'handler' | 'tooltip' | 'base';

  export interface ListenersStore  {
    startDragListener: ((e: MouseEvent) => any)[],
    stopDragListener: ((e: MouseEvent) => any)[]
  }

  export interface Props {
    container: HTMLElement,
    min: number,
    max: number,
    intervals: boolean[],
    orientation: 'vertical' | 'horizontal',
    tooltipOptions: {
      enabled: boolean,
      alwaysShown?: boolean
    },
    bemBlockClassName?: string,
    onDragHandler: (currents: View.State['currents']) => void
  }

  export interface State {
    currents: number[],
  }

  export interface Interface {
    props: Props,
    state: State,
    render: () => void,
    destroy: () => void,
    setProps: (props: Props) => void,
    setState: (state: State) => void,
    updateState: (action: StateActions) => void
  }
}

export default View;