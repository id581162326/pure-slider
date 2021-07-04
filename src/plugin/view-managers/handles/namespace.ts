import DataManager from 'view-managers/data/namespace';

namespace HandlesManager {
  export interface Props extends DataManager.Props {
    step: number,
    coordinates: [number] | [number, number],
    bemBlockClassName?: string,
    onChange: (coordinates: Props['coordinates']) => void
  }

  export interface State {
    coordinates: Props['coordinates']
  }

  export interface Interface {
    appendNodesTo: <Parent extends HTMLElement>(parent: Parent) => this,
    moveTo: (coordinates: Props['coordinates']) => this
  }
}

export default HandlesManager;