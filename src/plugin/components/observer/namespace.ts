namespace Observer {
  export interface Listener<State extends object> {
    notify: (state: State) => void
  }

  export interface Interface<State extends object> {
    listeners: Listener<State>[],
    notify: (state: State) => void,
    attach: (listener: Listener<State>) => void,
    detach: (listener: Listener<State>) => void
  }
}

export default Observer;