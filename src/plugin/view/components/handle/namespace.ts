namespace Handle {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    onDrag: (dragDelta: {x: number, y: number}) => void,
    onKeyPress: (actionType: 'inc' | 'dec') => void,
    bemBlockClassName?: string
  }

  export interface Interface {
    props: Props,
    node: HTMLDivElement,
    moveTo: (percent: number) => void
  }
}

export default Handle;