namespace S {
  export type Range = [number, number]

  export type Currents = [number] | [number, number]

  export type Intervals = [boolean, boolean] | [boolean, boolean, boolean]

  export type Orientation = 'horizontal' | 'vertical'

  export type TooltipOptions = {enabled: boolean, alwaysShown?: boolean}

  export interface Props {
    container: HTMLElement,
    range: Range,
    step: number,
    margin: number,
    currents: Currents,
    intervals: Intervals,
    orientation: Orientation,
    tooltipOptions: TooltipOptions,
    bemBlockClassName?: string,
    onChangeCurrents?: (currents: Currents) => void
  }

  export interface Interface {
    setOrientation: (orientation: Orientation) => void,
    setHandlers: (currents: Currents) => void
  }
}

export default S;