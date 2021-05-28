import Connect from '../components/connect/namespace';
import Handler from '../components/handler/namespace';
import Tooltip from '../components/tooltip/namespace';
import Base from '../components/base/namespace';
import Container from '../components/container/namespace';
import Scale from '../components/scale/namespace';
import Unit from '../components/unit/namespace';
import Element from '../components/element/namespace';

namespace View {
  export type Connect = Connect.Interface;

  export type ConnectProps = Connect.Props;

  export type Handler = Handler.Interface;

  export type HandlerProps = Handler.Props;

  export type Tooltip = Tooltip.Interface;

  export type Scale = Scale.Interface;

  export type ScaleProps = Scale.Props;

  export type Unit = Unit.Interface;

  export type Base = Base.Interface;

  export type BaseProps = Base.Props;

  export type Container = Container.Interface;

  export type ContainerProps = Container.Props;

  export type Elements = Handler | Connect | Base | Container | Scale | Unit | Tooltip;

  export type MovableElement = Connect | Handler | Scale;

  export type Range = [number, number];

  export type Currents = [number, number] | [number];

  export type DragType = 'start' | 'end' | 'single';

  export type ConnectType = 'inner-range' | 'outer-range' | 'from-start' | 'to-end' | 'none';

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

  export type Of = (o: Props, s: State) => Interface;

  export type Update = (a: Action) => void;

  export type MoveElementTo = <Element extends MovableElement>(xs: Currents) => (e: Element) => Element;

  export type AppendElementTo = <Parent extends Element.Interface, Element extends Elements>(p: Parent) => (e: Element) => Element;

  export type GetBemBlockClassName = () => Element.BemBlockClassName;

  export type RenderContainer = () => Container;

  export type RenderBase = () => Base;

  export type RenderConnects = () => Connect[];

  export type RenderHandlers = () => [Handler] | [Handler, Handler];

  export type RenderScale = () => Scale;

  export type MoveHandlersTo = (xs: Currents) => void;

  export type HandleDrag = (t: DragType) => (d: number) => void;

  export type HandleClick = (x: number) => void;

  export type OnChange = (currents: Currents) => void;

  export interface Props {
    container: HTMLElement,
    tooltipOptions: TooltipOptions,
    scaleOptions: ScaleOptions,
    themeBemBlockClassName?: string,
    onChange: OnChange
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