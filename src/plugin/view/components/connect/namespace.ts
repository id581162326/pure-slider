namespace Connect {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    bemBlockClassName?: string
  }

  export interface Interface {
    node: HTMLDivElement,
    moveTo: (pos: number, size: number) => void
  }
}

export default Connect;