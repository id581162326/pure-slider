import Slider from '../../../plugin/slider/namespace';

namespace Switcher {
  export type Parent = HTMLElement;

  export type Slider = Slider.Interface;

  export type Of = (o: Props) => (p: HTMLElement) => Interface;

  export type ConnectTypeChangedListener = Slider.Listener;

  export type OnChange = (x: number) => void;

  export interface Props {
    label: string,
    onChange: OnChange
  }

  export interface Interface {
  }
}

export default Switcher;