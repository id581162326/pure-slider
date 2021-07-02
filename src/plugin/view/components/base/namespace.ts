namespace Base {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    onClick: (clickCoord: {x: number, y: number}) => void,
    bemBlockClassName?: string
  }

  export interface Interface {
    node: HTMLDivElement
  }
}

export default Base;