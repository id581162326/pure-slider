namespace Tooltip {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    alwaysShown: boolean,
    bemBlockClassName?: string
  }

  export interface Interface {
    node: HTMLSpanElement,
    setValue: (value: number) => this
  }
}

export default Tooltip;