import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import View from '../components/view/index';
import Model from '../components/model';
import Controller from '../components/controller';

import Namespace from './namespace';

class Slider implements Namespace.Interface {
  static of: Namespace.Of = (container) => (props) => new Slider(container, props);

  public readonly updateCurrents: Namespace.UpdateCurrents = (currents) => {
    this.controller.dispatch({type: 'UPDATE_CURRENTS', currents});
  };

  public readonly toggleScale: Namespace.ToggleScale = () => {
    this.controller.dispatch({type: 'TOGGLE_SCALE'});
  };

  public readonly toggleRange: Namespace.ToggleRange = () => {
    const {currents} = this.model.getState();

    this.controller.dispatch({
      type: 'UPDATE_CURRENTS',
      currents: A.size(currents) === 2
        ? [pipe(currents, NEA.head)]
        : [pipe(currents, NEA.head), pipe(currents, NEA.head)]
    });
  };

  public readonly toggleOrientation: Namespace.ToggleOrientation = () => {
    this.controller.dispatch({type: 'TOGGLE_ORIENTATION'});
  };

  public readonly toggleTooltips: Namespace.ToggleTooltips = () => {
    this.controller.dispatch({type: 'TOGGLE_TOOLTIPS'});
  };

  public readonly attachListener: Namespace.AttachListener = (listener) => {
    this.controller.dispatch({type: 'ATTACH_LISTENER', listener});
  };

  public readonly updateStep: Namespace.UpdateStep = (step) => {
    this.controller.dispatch({type: 'UPDATE_STEP', step});
  };

  public readonly updateMargin: Namespace.UpdateMargin = (margin) => {
    this.controller.dispatch({type: 'UPDATE_MARGIN', margin});
  };

  public readonly updateRange: Namespace.UpdateRange = (range) => {
    this.controller.dispatch({type: 'UPDATE_RANGE', range});
  };

  public readonly setConnectType: Namespace.SetConnectType = (connectType) => {
    this.controller.dispatch({type: 'SET_CONNECT_TYPE', connectType});
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
      onChange: this.updateCurrents
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

    this.attachListener(this.viewListener);
  }

  private readonly controller: Namespace.Controller;

  private readonly view: Namespace.View;

  private readonly model: Namespace.Model;

  private readonly viewListener: Namespace.Listener = {
    update: (action) => {
      switch (action.type) {
        case 'CURRENTS_UPDATED': {
          this.view.update({type: 'UPDATE_CURRENTS', currents: action.currents});

          break;
        }

        case 'RANGE_UPDATED': {
          this.view.update({type: 'UPDATE_RANGE', range: action.range});

          break;
        }

        case 'STEP_UPDATED': {
          this.view.update({type: 'UPDATE_STEP', step: action.step});
        }
      }
    }
  };
}

export default Slider;