import {flow, pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'helpers/index';

import Namespace from './namespace';

class Observer<State extends object> implements Namespace.Interface<State> {
  public listeners: Namespace.Listener<State>[] = [];

  public readonly notify = (state: State) => {pipe(this.listeners, pipe(state, this.notifyListener, A.map));};

  public readonly attach = (listener: Namespace.Listener<State>) => {
    this.listeners.push(listener);
  };

  public readonly detach = (listener: Namespace.Listener<State>) => {
    this.listeners = pipe(this.listeners, A.filter(flow(H.eq(listener), H.not)));
  };

  private readonly notifyListener = (state: State) => (listener: Namespace.Listener<State>) => listener.notify(state);
}

export default Observer;