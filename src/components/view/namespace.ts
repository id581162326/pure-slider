import Connect from './connect/namespace';
import Handler from './handler/namespace';
import Tooltip from './tooltip/namespace';
import Base from './base/namespace';
import Container from './container/namespace';
import Element from './abstract-element/namespace';

namespace View {
  export type Connect = Connect.Interface;

  export type ConnectProps = Connect.Props;

  export type Handler = Handler.Interface;

  export type HandlerProps = Handler.Props;

  export type Tooltip = Tooltip.Interface;

  export type TooltipProps = Tooltip.Props;

  export type Base = Base.Interface;

  export type BaseProps = Base.Props;

  export type Container = Container.Interface;

  export type ContainerProps = Container.Props;

  export type MovableElement = Connect | Handler | Tooltip;

  export type Range = [number, number];

  export type Currents = [number, number] | [number];

  export type Intervals = [boolean, boolean, boolean] | [boolean, boolean];

  export type Orientation = 'horizontal' | 'vertical';

  export type TooltipOptions = {
    enabled: boolean,
    alwaysShown: boolean
  };

  export interface MoveHandlers {
    type: 'MOVE_HANDLERS',
    currents: Currents
  }

  export type Action = MoveHandlers;

  export type Of = (o: Props, s: State) => Interface;

  export type Update = (a: Action) => void;

  export type Destroy = () => void;

  export type MoveElementTo = <Element extends MovableElement>(xs: Currents) => (e: Element) => Element;

  export type AppendElementTo = <Parent extends Element.Interface, Element extends Element.Interface>(p: Parent) => (e: Element) => Element

  export type GetBemBlockClassName = () => Element.BemBlockClassName;

  export type RenderContainer = () => Container;

  export type RenderBase = () => Base;

  export type RenderConnects = () => Connect[];

  export type RenderHandlers = () => Handler[];

  export type RenderTooltips = () => Tooltip[];

  export type MoveAllElementsTo = (xs: Currents) => void;

  export type OnChange = (currents: Currents) => void;

  export interface Props {
    container: HTMLElement,
    range: Range,
    orientation: Orientation,
    tooltipOptions: TooltipOptions,
    intervals: Intervals,
    themeBemBlockClassName?: string,
    onChange: OnChange
  }

  export interface State {
    currents: Currents
  }

  export interface Interface {
    destroy: Destroy,
    update: Update
  }
}

export default View;