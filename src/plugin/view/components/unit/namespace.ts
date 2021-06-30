namespace Unit {
  export interface Props {
    value: number,
    orientation: 'horizontal' | 'vertical',
    showValue: boolean,
    onClick: (value: number) => void,
    bemBlockClassName?: string
  }

  export interface Interface {
    node: HTMLDivElement,
    setActive: (active: boolean) => void
  }
}

export default Unit;