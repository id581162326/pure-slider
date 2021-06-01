import TextField from '../text-field/namespace';

namespace Options {
  export type Parent = HTMLElement | DocumentFragment;

  export type Of = (props: Props) => <T extends Parent>(parent: T) => Interface;

  export type TextField = TextField.Interface;

  export type Currents = [number, number];

  export type Range = [number, number];

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'none';

  export type MapOptions = (optionsNode: HTMLDivElement) => HTMLDivElement;

  export type OnConnectTypeChange = (connectType: ConnectType) => void;

  export type OnCurrentsChange = (currents: Currents) => void;

  export type OnRangeChange = (range: Range) => void;

  export type OnStepChange = (step: number) => void;

  export type OnMarginChange = (margin: number) => void;

  export type OnOrientationToggle = () => void;

  export type OnScaleToggle = () => void;

  export type OnTooltipsToggle = () => void;

  export type OnRangeToggle = () => void;

  export interface Props {
    onConnectTypeChange: OnConnectTypeChange,
    onCurrentsChange: OnCurrentsChange,
    onRangeChange: OnRangeChange,
    onStepChange: OnStepChange,
    onMarginChange: OnMarginChange,
    onOrientationToggle: OnOrientationToggle,
    onScaleToggle: OnScaleToggle,
    onTooltipsToggle: OnTooltipsToggle,
    onRangeToggle: OnRangeToggle
  }

  export interface Interface {
    updateCurrents: (currents: Currents) => void,
    updateRange: (range: Range) => void,
    updateStep: (step: number) => void,
    updateMargin: (margin: number) => void
  }
}

export default Options;