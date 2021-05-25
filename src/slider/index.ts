import * as O from 'fp-ts/Option';
import {constant, pipe} from 'fp-ts/function';

import View from '../components/view';
import Model from '../components/model';
import Controller from '../components/controller';

import * as H from '../helpers';

import Namespace from './namespace';

class Slider implements Namespace.Interface {
  public readonly moveHandlers: Namespace.MoveHandlers = (currents) => {
    this.controller.dispatch({type: 'MOVE_HANDLERS', currents});
  };

  public readonly toggleScale: Namespace.ToggleScale = () => {
    this.controller.dispatch({type: 'TOGGLE_SCALE'});
  }

  public readonly toggleOrientation: Namespace.ToggleOrientation = () => {
    this.controller.dispatch({type: 'TOGGLE_ORIENTATION'});
  }

  public readonly toggleTooltips: Namespace.ToggleTooltips = () => {
    this.controller.dispatch({type: 'TOGGLE_TOOLTIPS'});
  }

  constructor(private readonly props: Namespace.Props) {
    const {container, range, step, margin, currents, connectType, orientation, handlerOptions, scaleOptions, themeBemBlockClassName} = props;

    this.view = pipe(View, H.prop('of'))({
      container,
      range,
      step,
      connectType,
      handlerOptions: {
        showTooltip: handlerOptions.showTooltip,
        tooltipAlwaysShown: pipe(handlerOptions.tooltipAlwaysShown, O.fromNullable, O.isSome)
      },
      scaleOptions: {
        enabled: scaleOptions.enabled,
        showUnitEach: scaleOptions.showUnitEach,
        withValue: pipe(scaleOptions.withValue, O.fromNullable, O.isSome),
        showValueEach: pipe(scaleOptions.showValueEach, O.fromNullable, O.getOrElse(constant(1)))
      },
      themeBemBlockClassName,
      onChange: this.moveHandlers
    }, {currents, orientation});

    this.model = pipe(Model, H.prop('of'))({
      range,
      step,
      margin,
      currents
    });

    this.controller = pipe(Controller, H.prop('of'))(this.view, this.model);

    this.moveHandlers(currents);
  }

  private readonly controller: Namespace.Controller;

  private readonly view: Namespace.View;

  private readonly model: Namespace.Model;
}

export default Slider;