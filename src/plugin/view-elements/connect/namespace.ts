namespace Connect {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    bemBlockClassName?: string
  }

  export interface Interface {
    node: HTMLDivElement,
    moveTo: (pos: number) => this,
    sizeTo: (size: number) => this
  }
}

export default Connect;