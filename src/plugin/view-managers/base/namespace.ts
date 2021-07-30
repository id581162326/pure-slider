import ComponentManager from 'view-managers/component/namespace';

namespace BaseManager {
  export interface Props extends ComponentManager.Props {
    coordinates: [number] | [number, number],
    bemBlockClassName?: string,
    onClick: (coordinates: Props['coordinates']) => void
  }

  export interface Interface {
    appendNodeTo: <Parent extends HTMLElement>(parent: Parent) => this
  }
}

export default BaseManager;