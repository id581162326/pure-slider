import Connect from '../components/connect/namespace';
import Handle from '../components/handle/namespace';
import Tooltip from '../components/tooltip/namespace';
import Base from '../components/base/namespace';
import Container from '../components/container/namespace';
import Scale from '../components/scale/namespace';
import Unit from '../components/unit/namespace';
import Element from '../components/element/namespace';

namespace View {
  export type ConnectInterface = Connect.Interface;

  export type ConnectProps = Connect.Props;

  export type HandleInterface = Handle.Interface;

  export type HandleProps = Handle.Props;

  export type TooltipInterface = Tooltip.Interface;

  export type ScaleInterface = Scale.Interface;

  export type ScaleProps = Scale.Props;

  export type UnitInterface = Unit.Interface;

  export type BaseInterface = Base.Interface;

  export type BaseProps = Base.Props;

  export type ContainerInterface = Container.Interface;

  export type ContainerProps = Container.Props;

  export type Elements = HandleInterface | ConnectInterface | BaseInterface | ContainerInterface | ScaleInterface | UnitInterface | TooltipInterface;

  export type MovableElement = ConnectInterface | HandleInterface | ScaleInterface;

  export type Range = [number, number];

  export type Currents = [number, number] | [number];

  export type HandleType = Handle.HandleType;

  export type ConnectType = 'inner-range' | 'outer-range' | 'from-start' | 'to-end' | 'single';

  export type Orientation = 'horizontal' | 'vertical';

  export interface TooltipOptions {
    alwaysShown: boolean
  }

  export interface ScaleOptions {
    withValue: boolean,
    showValueEach: number
  }

  export interface UpdateCurrents {
    type: 'UPDATE_CURRENTS',
    currents: Currents
  }

  export interface ToggleScale {
    type: 'TOGGLE_SCALE'
  }

  export interface ToggleOrientation {
    type: 'TOGGLE_ORIENTATION'
  }

  export interface ToggleTooltips {
    type: 'TOGGLE_TOOLTIPS'
  }

  export interface UpdateStep {
    type: 'UPDATE_STEP',
    step: number
  }

  export interface UpdateRange {
    type: 'UPDATE_RANGE',
    range: Range
  }

  export interface SetConnectType {
    type: 'SET_CONNECT_TYPE',
    connectType: ConnectType
  }

  export interface ToggleRange {
    type: 'TOGGLE_RANGE'
  }

  export type Action = UpdateCurrents | ToggleScale | ToggleTooltips | ToggleOrientation | UpdateStep | UpdateRange | SetConnectType | ToggleRange;

  export type Of = (props: Props, state: State) => Interface;

  export type Update = (action: Action) => void;

  export type MoveElementTo = <Element extends MovableElement>(currents: Currents) => (e: Element) => Element;

  export type DestroyElement = <Element extends Elements>(element: Element) => void;

  export type GetElementNode = <Element extends Elements>(element: Element) => HTMLElement;

  export type GetBemBlockClassName = () => Element.BemBlockClassName;

  export type Destroy = () => void;

  export type Render = () => void;

  export type ReRender = () => void;

  export type RenderContainer = () => ContainerInterface;

  export type RenderBase = () => BaseInterface;

  export type RenderConnects = () => ConnectInterface[];

  export type RenderHandles = () => [HandleInterface] | [HandleInterface, HandleInterface];

  export type RenderScale = () => ScaleInterface;

  export type MoveHandlesTo = (currents: Currents) => void;

  export type HandleDrag = (handleType: HandleType) => (delta: number) => void;

  export type HandleClick = (coord: number) => void;

  export type OnChange = (currents: Currents) => void;

  export interface Props {
    container: HTMLElement,
    tooltipOptions: TooltipOptions,
    scaleOptions: ScaleOptions,
    onChange: OnChange,
    themeBemBlockClassName?: string
  }

  export interface State {
    range: Range,
    step: number,
    connectType: ConnectType,
    orientation: Orientation,
    currents: Currents,
    showTooltips: boolean,
    showScale: boolean
  }

  export interface Interface {
    update: Update
  }
}

export default View;