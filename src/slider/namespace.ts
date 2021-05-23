import View from '../components/view/namespace';
import Model from '../components/model/namespace';
import Controller from '../components/controller/namespace';

namespace Slider {
  export type Range = [number, number];

  export type Currents = [number] | [number, number];

  export type Intervals = [boolean, boolean] | [boolean, boolean, boolean];

  export type Orientation = 'horizontal' | 'vertical';

  export type TooltipOptions = {enabled: boolean, alwaysShown?: boolean};

  export type View = View.Interface

  export type Model = Model.Interface;

  export type Controller = Controller.Interface;

  export interface Props {
    container: HTMLElement,
    range: Range,
    step: number,
    margin: number,
    currents: Currents,
    intervals: Intervals,
    orientation: Orientation,
    tooltipOptions: TooltipOptions,
    themeBemBlockClassName?: string
  }

  export interface Interface {
    moveHandlers: (currents: Currents) => void
  }
}

export default Slider;