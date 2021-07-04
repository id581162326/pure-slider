namespace DataManager {
  export interface Props {
    orientation: 'horizontal' | 'vertical',
    range: [number, number],
    container: HTMLElement,
  }
}

export default DataManager;