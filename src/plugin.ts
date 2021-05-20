import View from './components/view';
import V from './components/view/namespace';

import Model from './components/model';
import M from './components/model/namespace';

import Controller from './components/controller';
import C from './components/controller/namespace';

import P from './namespace';

export default class implements P.Interface {
  constructor(props: P.Props) {
    this.props = props;

    this.init();
  }

  public setHandlersPosition(currents: number[]) {
    this.controller.updateState({type: 'UPDATE_HANDLERS_POSITION', currents})
  }

  public setOrientation(orientation: 'horizontal' | 'vertical') {
    this.controller.updateState({type: 'SET_ORIENTATION', orientation});
  }

  private readonly props: P.Props;

  private controller: C.Interface = new Controller();

  private view: V.Interface = new View();

  private model: M.Interface = new Model();

  private init: () => void = () => {
    const {container, min, max, step, margin, currents, intervals, orientation, tooltipOptions, bemBlockClassName = 'pure-slider-theme', onChange} = this.props;

    this.view.setProps({
      container, min, max, intervals, tooltipOptions, bemBlockClassName,
      onChange: (currents: number[]) => {
        onChange(currents);
        this.controller.updateState({type: 'UPDATE_HANDLERS_POSITION', currents});
      }
    });

    this.view.setState({currents, orientation});

    this.view.render();

    this.model.setProps({min, max, margin, step});

    this.model.setState({currents});

    this.controller.setView(this.view);

    this.controller.setModel(this.model);

    this.controller.initListener();
  }
}