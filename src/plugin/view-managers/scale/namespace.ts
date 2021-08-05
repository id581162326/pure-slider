import ComponentManager from 'view-managers/component/namespace';

namespace ScaleManager {
  export interface Props extends ComponentManager.Props {
    coordinates: [number] | [number, number],
    connectType: 'from-start' | 'to-end' | 'inner-range' | 'outer-range' | 'none',
    step: number,
    bemBlockClassName?: string
  }

  export interface Interface {
    moveTo: (coordinates: Props['coordinates']) => this
  }
}

export default ScaleManager;