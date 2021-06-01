import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import View from '../components/view/index';
import Model from '../components/model';
import Controller from '../components/controller';

import Namespace from './namespace';

class Slider implements Namespace.Interface {
  static of: Namespace.Of = (container) => (props) => new Slider(container, props);

  public readonly dispatch: Namespace.Dispatch = (action) => {
    this.controller.dispatch(action);
  };

  constructor(container: HTMLElement, private readonly props: Namespace.Props) {
    const {range, step, margin, currents, connectType, orientation, tooltipOptions, scaleOptions, themeBemBlockClassName} = props;

    this.view = View.of({
      container,
      tooltipOptions: {
        alwaysShown: tooltipOptions ? tooltipOptions.alwaysShown : false
      },
      scaleOptions: {
        withValue: scaleOptions ? scaleOptions.withValue : false,
        showValueEach: scaleOptions ? scaleOptions.showValueEach ? scaleOptions.showValueEach : step : step,
      },
      themeBemBlockClassName,
      onChange: this.handleCurrentsChange
    }, {
      currents,
      range,
      step,
      orientation: orientation ? orientation : 'horizontal',
      connectType: connectType ? connectType : 'inner-range',
      showScale: pipe(scaleOptions, O.fromNullable, O.isSome),
      showTooltips: pipe(tooltipOptions, O.fromNullable, O.isSome)
    });

    this.model = Model.of({
      range,
      step,
      margin,
      currents
    });

    this.controller = Controller.of(this.view, this.model);
  }

  private readonly controller: Namespace.Controller;

  private readonly view: Namespace.View;

  private readonly model: Namespace.Model;

  private readonly handleCurrentsChange: Namespace.HandleUpdateCurrents = (currents) => {
    this.dispatch({type: 'UPDATE_CURRENTS', currents});
  };
}

export default Slider;