namespace Observer {
  export type Currents = number[];

  export interface CurrentsUpdated {
    type: 'CURRENTS_UPDATED',
    currents: Currents
  }

  export type Action = CurrentsUpdated;

  export type Attach = (o: Listener) => void;

  export interface Listener {
    update: (a: Action) => void
  }

  export interface Interface {
    listeners: Listener[],
    attach: Attach
  }
}

export default Observer;