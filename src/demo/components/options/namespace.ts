import TextField from '../text-field/namespace';

namespace Options {
  export type Parent = HTMLElement | DocumentFragment;

  export type Of = (props: Props) => <T extends Parent>(parent: T) => Interface;

  export type TextField = TextField.Interface;

  export type Currents = [number, number];

  export type Range = [number, number];

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'single';

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

  export type UpdateData = (data: Partial<Data>) => void;

  export type UpdateRange = () => void;

  export type UpdateMargin = () => void;

  export type UpdateStep = () => void;

  export type UpdateCurrents = () => void;

  export interface Data {
    step: number,
    margin: number,
    range: Range,
    currents: Currents
  }

  export interface Props {
    data: Data,
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
    updateData: UpdateData
  }
}

export default Options;