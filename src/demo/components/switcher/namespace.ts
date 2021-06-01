import Slider from '../../../plugin/slider/namespace';

namespace Switcher {
  export type Parent = HTMLElement | DocumentFragment;

  export type Slider = Slider.Interface;

  export type Of = (props: Props) => <T extends Parent>(parent: T) => Interface;

  export type ConnectTypeChangedListener = Slider.Listener;

  export type MapSwitcher = (switcherNode: HTMLDivElement) => HTMLDivElement;

  export type OnChange = (x: number) => void;

  export interface Props {
    label: string,
    onChange: OnChange
  }

  export interface Interface {
  }
}

export default Switcher;