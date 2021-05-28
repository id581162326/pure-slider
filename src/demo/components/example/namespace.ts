import * as O from 'fp-ts/Option';

import Slider from '../../../plugin/slider/namespace';

import Options from '../options/namespace';

namespace Example {
  export type Of = (o: Props) => <T extends HTMLElement>(p: T) => Interface;

  export type SetInnerText = (x: HTMLElement) => HTMLElement;

  export type RenderSlider = () => O.Option<Slider.Interface>;

  export type RenderOptions = (x: HTMLElement) => HTMLElement;

  export type Parent = HTMLElement;

  export type Slider = Slider.Interface;

  export type Listener = Slider.Listener;

  export type Options = Options.Interface;

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'none';

  export type HandleConnectTypeChanged = (t: ConnectType) => void;

  export interface Props {
    title: string,
    description: string,
    sliderConfig: Slider.Props
  }

  export interface Interface {
  }
}

export default Example;