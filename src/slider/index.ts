import View from '../components/view';
import V from '../components/view/namespace';

import Model from '../components/model';
import M from '../components/model/namespace';

import Controller from '../components/controller';
import C from '../components/controller/namespace';

import S from './namespace';

export default class implements S.Interface {
  constructor(props: S.Props) {
    this.props = props;

    this.init();
  }

  // methods

  public setHandlers(currents: V.Currents) {
    this.controller.updateProps({type: 'SET_HANDLERS', currents});
  }

  public setOrientation(orientation: V.Orientation) {
    this.controller.updateProps({type: 'SET_ORIENTATION', orientation});
  }

  public getCurrents(): number[] {
    return (this.model.state['currents']);
  }

  // properties

  private readonly props: S.Props;

  private controller: C.Interface = new Controller();

  private view: V.Interface = new View();

  private model: M.Interface = new Model();

  // init

  private init: () => void = () => {
    const {container, min, max, step, margin, currents, intervals, orientation, tooltipOptions, onChangeCurrents} = this.props;

    const viewProps: V.Props = {
      container, min, max, currents, intervals, orientation, tooltipOptions,
      onChange: (currents: V.Currents) => this.controller.updateProps({type: 'SET_HANDLERS', currents}),
      ...(this.props.bemBlockClassName ? {bemBlockClassName: this.props.bemBlockClassName} : {})
    };

    this.view.setProps(viewProps);

    this.view.render();

    const modelState: M.State = {min, max, currents, margin, step, ...(onChangeCurrents ? {onChangeCurrents} : {})};

    this.model.setState(modelState);

    this.controller.setView(this.view);

    this.controller.setModel(this.model);

    this.controller.initListener();
  };
}