namespace P {
  export interface Props {
    container: HTMLElement,
    min: number,
    max: number,
    step: number,
    margin: number,
    currents: number[],
    intervals: boolean[],
    orientation: 'vertical' | 'horizontal',
    tooltipOptions: {
      enabled: boolean,
      alwaysShown?: boolean
    },
    bemBlockClassName?: string,
    onChange: (currents: number[]) => void
  }

  export interface Interface {
    setOrientation: (orientation: 'horizontal' | 'vertical') => void,
    setHandlersPosition: (currents: number[]) => void
  }
}

export default P;