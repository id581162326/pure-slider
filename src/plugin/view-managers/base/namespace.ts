import DataManager from 'view-managers/data/namespace';

namespace BaseManager {
  export interface Props extends DataManager.Props {
    coordinates: [number] | [number, number],
    bemBlockClassName?: string,
    onClick: (coordinates: Props['coordinates']) => void
  }

  export interface Interface {
    appendNodeTo: <Parent extends HTMLElement>(parent: Parent) => this
  }
}

export default BaseManager;