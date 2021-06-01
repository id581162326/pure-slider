import TextField from '../text-field/namespace';

namespace Options {
  export type Parent = HTMLElement | DocumentFragment;

  export type Of = (o: Props) => <T extends Parent>(p: T) => Interface;

  export type TextField = TextField.Interface;

  export type Currents = [number, number];

  export type Range = [number, number];

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'none';

  export type OnConnectTypeChange = (t: ConnectType) => void;

  export type OnCurrentsChange = (xs: Currents) => void;

  export type OnRangeChange = (xs: Range) => void;

  export type OnStepChange = (x: number) => void;

  export type OnMarginChange = (x: number) => void;

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
    updateCurrents: (xs: Currents) => void,
    updateRange: (xs: Range) => void,
    updateStep: (x: number) => void,
    updateMargin: (x: number) => void
  }
}

export default Options;