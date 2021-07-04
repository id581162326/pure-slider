import DataManager from 'view-managers/data/namespace';

namespace ConnectsManager {
  export type ConnectType = Array<'from-start' | 'to-end' | 'inner'>;

  export interface Props extends DataManager.Props {
    connectType: 'from-start' | 'to-end' | 'inner-range' | 'outer-range' | 'none',
    coordinates: [number] | [number, number],
    bemBlockClassName?: string
  }

  export interface Interface {
    appendNodesTo: <Parent extends HTMLElement>(parent: Parent) => this,
    moveTo: (coordinates: Props['coordinates']) => this
  }
}

export default ConnectsManager;