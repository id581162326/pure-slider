namespace ComponentManager {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    range: [number, number],
    container: HTMLElement,
  }
}

export default ComponentManager;