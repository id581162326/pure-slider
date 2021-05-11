import Model from './namespace';

export default class implements Model.Interface {
  public props: Model.Props = {
    min: 0,
    max: 10,
    step: 1,
    margin: 1,
    currents: [5],
    floatCurrents: false
  };

  setListener(listener: Model.Listener) {
    this.listener = listener;
  }

  private listener: Model.Listener = {
    update: (data: Model.Action) => console.log(data)
  };
}