import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import View from '../components/view';
import Model from '../components/model';
import Controller from '../components/controller';

import * as H from '../helpers';

import Namespace from './namespace';

class Slider implements Namespace.Interface {
  public readonly setHandlers = (currents: Namespace.Currents) => {
    this.controller.dispatch({type: 'MOVE_ELEMENTS', currents});
  };

  constructor(private readonly props: Namespace.Props) {
    const {container, range, step, margin, currents, intervals, orientation, tooltipOptions, themeBemBlockClassName} = props;

    this.model = pipe(Model, H.prop('of'))({
      range,
      step,
      margin,
      currents
    });

    this.view = pipe(View, H.prop('of'))({
      container,
      range,
      currents,
      intervals,
      orientation,
      tooltipOptions: {
        enabled: tooltipOptions.enabled,
        alwaysShown: tooltipOptions.enabled && pipe(tooltipOptions.alwaysShown, O.fromNullable, O.isSome)
      },
      themeBemBlockClassName,
      onChange: this.setHandlers
    });

    this.controller = pipe(Controller, H.prop('of'))(this.view, this.model);
  }

  private readonly controller: Namespace.Controller;

  private readonly view: Namespace.View;

  private readonly model: Namespace.Model;
}

export default Slider;