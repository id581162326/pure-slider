namespace Handle {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    onDrag: (dragDelta: {x: number, y: number}) => void,
    onIncrease: () => void,
    onDecrease: () => void,
    bemBlockClassName?: string
  }

  export interface Interface {
    node: HTMLDivElement,
    moveTo: (percent: number) => this,
    removeSideEffects: () => this
  }
}

export default Handle;