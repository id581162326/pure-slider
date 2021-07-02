namespace Connect {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    bemBlockClassName?: string
  }

  export interface Interface {
    node: HTMLDivElement,
    moveTo: (pos: number) => void,
    sizeTo: (size: number) => void
  }
}

export default Connect;