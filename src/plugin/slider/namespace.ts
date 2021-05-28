import View from '../components/view/index/namespace';
import Model from '../components/model/namespace';
import Controller from '../components/controller/namespace';
import Observer from '../components/observer/namespace';

namespace Slider {
  export type Range = [number, number];

  export type Currents = [number] | [number, number];

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'none';

  export type Orientation = 'horizontal' | 'vertical';

  export type TooltipOptions = { alwaysShown: boolean };

  export type ScaleOptions = {
    withValue: boolean,
    showValueEach?: number
  }

  export type View = View.Interface

  export type Model = Model.Interface;

  export type Controller = Controller.Interface;

  export type Listener = Observer.Listener;

  export type Of = (n: HTMLElement) => (o: Props) => Interface;

  export type UpdateCurrents = (currents: Currents) => void;

  export type ToggleScale = () => void;

  export type ToggleOrientation = () => void;

  export type ToggleTooltips = () => void;

  export type ToggleRange = () => void;

  export type AttachListener = (o: Listener) => void;

  export type UpdateStep = (x: number) => void;

  export type UpdateRange = (xs: Range) => void;

  export type UpdateMargin = (x: number) => void;

  export type SetConnectType = (t: ConnectType) => void;

  export interface Props {
    range: Range,
    step: number,
    margin: number,
    currents: Currents,
    connectType?: ConnectType,
    orientation?: Orientation,
    tooltipOptions?: TooltipOptions,
    scaleOptions?: ScaleOptions,
    themeBemBlockClassName?: string
  }

  export interface Interface {
    attachListener: AttachListener,
    updateCurrents: UpdateCurrents,
    toggleScale: ToggleScale,
    toggleOrientation: ToggleOrientation,
    toggleTooltips: ToggleTooltips,
    toggleRange: ToggleRange,
    updateStep: UpdateStep,
    setConnectType: SetConnectType,
    updateRange: UpdateRange,
    updateMargin: UpdateMargin
  }
}

export default Slider;