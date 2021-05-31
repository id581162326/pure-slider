import Element from '../element/namespace';
namespace Tooltip {
  export type Node = HTMLSpanElement;

  export type Currents = Element.Currents;

  export type Of = (props: Props) => Interface;

  export type SetValue = (value: number) => void;

  export interface Props extends Element.Props {
    alwaysShown: boolean
  }

  export interface Interface extends Element.Interface {
    setValue: SetValue
  }
}

export default Tooltip;