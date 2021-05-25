import Element from '../element/namespace';
namespace Tooltip {
  export type Node = HTMLSpanElement;

  export type Currents = Element.Currents;

  export type Of = (o: Props) => Interface;

  export type SetValue = (x: number) => void;

  export interface Props extends Element.Props {
    alwaysShown: boolean
  }

  export interface Interface extends Element.Interface {
    setValue: SetValue
  }
}

export default Tooltip;