import Namespace from './namespace';

class Observer implements Namespace.Interface {
  public readonly listeners: Namespace.Listener[] = [];

  public readonly attach: Namespace.Attach = (listener) => {
    this.listeners.push(listener);
  };
}

export default Observer;