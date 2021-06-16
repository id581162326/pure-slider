import * as O from 'fp-ts/Option';

import Slider from '../../../plugin/slider/namespace';

import Options from '../options/namespace';

namespace Example {
  export type Parent = HTMLElement | DocumentFragment;

  export type Of = (props: Props) => <T extends Parent>(parent: T) => Interface;

  export type Currents = [number, number];

  export type Range = [number, number];

  export type RenderSlider = () => O.Option<Slider.Interface>;

  export type MapExample = (exampleNode: HTMLElement) => HTMLElement;

  export type AttachOptionsListener = () => void;

  export type HandleOrientationToggle = () => void;

  export type HandleTooltipsToggle = () => void;

  export type HandleScaleToggle = () => void;

  export type HandleRangeToggle = () => void;

  export type HandleConnectTypeChange = (connectType: ConnectType) => void;

  export type HandleCurrentsChange = (currents: Currents) => void;

  export type HandleRangeChange = (range: Range) => void;

  export type HandleStepChange = (step: number) => void;

  export type HandleMarginChange = (margin: number) => void;

  export type SliderInterface = Slider.Interface;

  export type Listener = Slider.Listener;

  export type Options = Options.Interface;

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'single';

  export interface Props {
    title: string,
    description: string,
    sliderConfig: Slider.Props
  }

  export interface Interface {
  }
}

export default Example;