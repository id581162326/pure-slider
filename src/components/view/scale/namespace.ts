import Element from '../shared/element/namespace';
import Unit from '../shared/unit/namespace';

namespace Scale {
  export type Node = HTMLDivElement;

  export type Unit = Unit.Interface;

  export type UnitProps = Unit.Props;

  export type Currents = Element.Currents;

  export type Of = (o: Props) => Interface;

  export type RenderSteps = () => Unit[];

  export type AppendUnits = () => void;

  export type OnClick = (x: number) => void;

  export type GetUnits = () => Unit[];

  export type MoveTo = (xs: Currents) => void;

  export interface Props extends Element.Props {
    step: number,
    connectType: 'outer-range' | 'inner-range' | 'from-start' | 'to-end' | 'none',
    withValue: boolean,
    showUnitEach: number,
    showValueEach: number,
    onClick: OnClick
  }

  export interface Interface extends Element.Interface {
    getUnits: GetUnits,
    moveTo: MoveTo
  }
}

export default Scale;