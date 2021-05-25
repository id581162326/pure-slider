import View from '../components/view/namespace';
import Model from '../components/model/namespace';
import Controller from '../components/controller/namespace';

namespace Slider {
  export type Range = [number, number];

  export type Currents = [number] | [number, number];

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'none';

  export type Orientation = 'horizontal' | 'vertical';

  export type HandlerOptions = {showTooltip: boolean, tooltipAlwaysShown?: boolean};

  export type ScaleOptions = {
    enabled: boolean,
    showUnitEach: number,
    withValue?: boolean,
    showValueEach?: number
  }

  export type View = View.Interface

  export type Model = Model.Interface;

  export type Controller = Controller.Interface;

  export type MoveHandlers = (currents: Currents) => void;

  export type ToggleScale = () => void;

  export type ToggleOrientation = () => void;

  export type ToggleTooltips = () => void;

  export interface Props {
    container: HTMLElement,
    range: Range,
    step: number,
    margin: number,
    currents: Currents,
    connectType: ConnectType,
    orientation: Orientation,
    handlerOptions: HandlerOptions,
    scaleOptions: ScaleOptions,
    themeBemBlockClassName?: string
  }

  export interface Interface {
    moveHandlers: MoveHandlers,
    toggleScale: ToggleScale,
    toggleOrientation: ToggleOrientation,
    toggleTooltips: ToggleTooltips
  }
}

export default Slider;