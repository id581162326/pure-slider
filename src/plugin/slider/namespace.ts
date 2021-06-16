import View from '../components/view/index/namespace';
import Model from '../components/model/namespace';
import Controller from '../components/controller/namespace';
import Observer from '../components/observer/namespace';

namespace Slider {
  export type Range = [number, number];

  export type Currents = [number] | [number, number];

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'single';

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

  export type Of = (container: HTMLElement) => (props: Props) => Interface;

  export type Dispatch = (action: Controller.Action) => void;

  export type HandleUpdateCurrents = (currents: Currents) => void;

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
    dispatch: Dispatch
  }
}

export default Slider;