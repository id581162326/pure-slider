import V from '../components/view/namespace';

namespace S {
  export interface Props {
    container: HTMLElement,
    min: number,
    max: number,
    step: number,
    margin: number,
    currents: V.Currents,
    intervals: V.Intervals,
    orientation: V.Orientation,
    tooltipOptions: V.TooltipOptions,
    bemBlockClassName?: string,
    onChangeCurrents?: (currents: V.Currents) => void
  }

  export interface Interface {
    setOrientation: (orientation: V.Orientation) => void,
    setHandlers: (currents: V.Currents) => void
  }
}

export default S;