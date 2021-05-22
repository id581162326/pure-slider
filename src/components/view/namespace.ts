namespace V {
  export type Currents = [number, number] | [number]

  export type Intervals = [boolean, boolean, boolean] | [boolean, boolean]

  export type Orientation = 'horizontal' | 'vertical';

  export type TooltipOptions = {
    enabled: boolean,
    alwaysShown?: boolean
  }

  export type NodeKeys = 'connect' | 'handler' | 'tooltip' | 'base';

  export interface NodeMap {
    id: number,
    node: HTMLDivElement | HTMLSpanElement
  }

  export interface SetHandlers {
    type: 'SET_HANDLERS',
    currents: Currents
  }

  export interface SetOrientation {
    type: 'SET_ORIENTATION',
    orientation: Orientation
  }

  export type Action = SetHandlers | SetOrientation;

  export interface EventListenersStore {
    startDragListener: ((e: MouseEvent) => any)[],
    stopDragListener: ((e: MouseEvent) => any)[]
  }

  export interface Props {
    container: HTMLElement,
    range: [number, number],
    orientation: Orientation,
    tooltipOptions: TooltipOptions,
    currents: Currents,
    intervals: Intervals,
    bemBlockClassName?: string,
    onChange: (currents: Currents) => void
  }

  export interface Interface {
    props: Props,
    render: () => void,
    destroy: () => void,
    setProps: (props: Props) => void,
    updateProps: (action: Action) => void
  }
}

export default V;