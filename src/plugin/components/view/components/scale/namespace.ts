import Element from '../element/namespace';
import Unit from '../unit/namespace';

namespace Scale {
  export type Node = HTMLDivElement;

  export type Unit = Unit.Interface;

  export type UnitProps = Unit.Props;

  export type Currents = Element.Currents;

  export type ConnectType = 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'none';

  export type Of = (props: Props) => Interface;

  export type RenderSteps = () => Unit[];

  export type AppendUnits = () => void;

  export type MoveTo = (currents: Currents) => void;

  export type OnClick = (coord: number) => void;

  export interface Props extends Element.Props {
    step: number,
    connectType: ConnectType,
    withValue: boolean,
    showValueEach: number,
    onClick: OnClick;
  }

  export interface Interface extends Element.Interface {
    moveTo: MoveTo
  }
}

export default Scale;