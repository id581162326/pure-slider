import Connect from './connect/namespace';
import Handler from './handler/namespace';
import Tooltip from './shared/tooltip/namespace';
import Base from './base/namespace';
import Container from './container/namespace';
import Scale from './scale/namespace';
import Unit from './shared/unit/namespace';
import Element from './shared/element/namespace';

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

  export type ConnectType = 'inner-range' | 'outer-range' | 'from-start' | 'to-end' | 'none';

  export type Orientation = 'horizontal' | 'vertical';

  export interface HandlerOptions {
    showTooltip: boolean,
    tooltipAlwaysShown: boolean
  }

  export interface ScaleOptions {
    enabled: boolean,
    showUnitEach: number,
    withValue: boolean,
    showValueEach: number
  }

  export interface MoveHandlers {
    type: 'MOVE_HANDLERS',
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

  export type Action = MoveHandlers | ToggleScale | ToggleTooltips | ToggleOrientation;

  export type Of = (o: Props, s: State) => Interface;

  export type Update = (a: Action) => void;

  export type Destroy = () => void;

  export type MoveElementTo = <Element extends MovableElement>(xs: Currents) => (e: Element) => Element;

  export type AppendElementTo = <Parent extends Element.Interface, Element extends Elements>(p: Parent) => (e: Element) => Element

  export type ToggleElementOrientation = <Element extends Elements> (e: Element) => Element;

  export type GetBemBlockClassName = () => Element.BemBlockClassName;

  export type RenderContainer = () => Container;

  export type RenderBase = () => Base;

  export type RenderConnects = () => Connect[];

  export type RenderHandlers = () => Handler[];

  export type RenderScale = () => Scale;

  export type MoveHandlersTo = (xs: Currents) => void;

  export type ToggleScaleOrientation = () => void;

  export type ToggleHandlersOrientation = () => void;

  export type ToggleConnectsOrientation = () => void;

  export type ToggleBaseAndContainerOrientation = () => void;

  export type ToggleTooltipElements = () => void;

  export type OnChange = (currents: Currents) => void;

  export type ToggleScaleElement = () => void;

  export interface Props {
    container: HTMLElement,
    range: Range,
    step: number,
    handlerOptions: HandlerOptions,
    scaleOptions: ScaleOptions,
    connectType: ConnectType,
    themeBemBlockClassName?: string,
    onChange: OnChange
  }

  export interface State {
    orientation: Orientation,
    currents: Currents
  }

  export interface Interface {
    destroy: Destroy,
    update: Update
  }
}

export default View;