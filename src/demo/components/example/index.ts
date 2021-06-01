import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Slider from '../../../plugin/slider';

import Fragment from '../fragment';
import Options from '../options';

import Namespace from './namespace';
import template from './index.html';
import './style.css';

Fragment.injectTemplate(template);

class Example extends Fragment <HTMLElement> implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Example(props, parent);

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, '#js-example', '.js-example');

    this.slider = this.renderSlider();

    pipe(this.mapExample, this.render);

    this.attachOptionListener();
  }

  private readonly slider: O.Option<Namespace.SliderInterface>;

  private options: O.Option<Namespace.Options> = O.none;

  private readonly mapExample: Namespace.MapExample = (exampleNode) => pipe(exampleNode, this.setInnerText, this.renderOptions);

  private readonly renderOptions: Namespace.MapExample = (exampleNode) => pipe(
    exampleNode,
    H.querySelector('.js-example__options'),
    O.some,
    O.map((optionsNode) => O.isSome(optionsNode)
      ? pipe(optionsNode, H.prop('value'), Options.of({
        onConnectTypeChange: this.handleConnectTypeChange,
        onCurrentsChange: this.handleCurrentsChange,
        onStepChange: this.handleStepChange,
        onMarginChange: this.handleMarginChange,
        onRangeChange: this.handleRangeChange,
        onOrientationToggle: this.handleOrientationToggle,
        onScaleToggle: this.handleScaleToggle,
        onTooltipsToggle: this.handleTooltipsToggle,
        onRangeToggle: this.handleRangeToggle
      }), (options) => this.options = O.some(options))
      : O.none),
    () => exampleNode
  );

  private readonly setInnerText: Namespace.MapExample = (exampleNode) => {
    const {title, description} = this.props;

    pipe(exampleNode, H.querySelector('.js-example__title'), O.some, O.map((titleNode) => O.isSome(titleNode)
      ? pipe(titleNode, H.prop('value'), H.setInnerText(title))
      : O.none)
    );

    pipe(exampleNode, H.querySelector('.js-example__description'), O.some, O.map((descriptionNode) => O.isSome(descriptionNode)
      ? pipe(descriptionNode, H.prop('value'), H.setInnerText(description))
      : O.none)
    );

    return (exampleNode);
  };

  private readonly handleOrientationToggle: Namespace.HandleOrientationToggle = () => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'TOGGLE_ORIENTATION'}]))
      : O.none)
  );

  private readonly handleTooltipsToggle: Namespace.HandleTooltipsToggle = () => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'TOGGLE_TOOLTIPS'}]))
      : O.none)
  );

  private readonly handleScaleToggle: Namespace.HandleScaleToggle = () => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'TOGGLE_SCALE'}]))
      : O.none)
  );

  private readonly handleRangeToggle: Namespace.HandleRangeToggle = () => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'TOGGLE_RANGE'}]))
      : O.none)
  );

  private readonly handleConnectTypeChange: Namespace.HandleConnectTypeChange = (connectType) => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'SET_CONNECT_TYPE', connectType}]))
      : O.none)
  );

  private readonly handleCurrentsChange: Namespace.HandleCurrentsChange = (currents) => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'UPDATE_CURRENTS', currents}]))
      : O.none)
  );

  private readonly handleRangeChange: Namespace.HandleRangeChange = (range) => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'UPDATE_RANGE', range}]))
      : O.none)
  );

  private readonly handleStepChange: Namespace.HandleStepChange = (step) => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'UPDATE_STEP', step}]))
      : O.none)
  );

  private readonly handleMarginChange: Namespace.HandleMarginChange = (margin) => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'UPDATE_MARGIN', margin}]))
      : O.none)
  );

  private readonly renderSlider: Namespace.RenderSlider = () => pipe(
    this.parent,
    H.querySelector('.js-example__slider'),
    O.some,
    O.map((sliderNode) => O.isSome(sliderNode)
      ? pipe(sliderNode as O.Some<HTMLDivElement>, H.prop('value'), Slider.of, H.call([this.props.sliderConfig]))
      : O.none)
  ) as O.Option<Namespace.SliderInterface>;

  private attachOptionListener: Namespace.AttachOptionsListener = () => pipe(
    this.slider,
    O.some,
    O.map((slider) => O.isSome(slider)
      ? pipe(slider, H.prop('value'), H.prop('dispatch'), H.call([{type: 'ATTACH_LISTENER', listener: this.optionsListener}]))
      : O.none)
  );

  private optionsListener: Namespace.Listener = {
    update: (action) => {
      switch (action.type) {
        case 'CURRENTS_UPDATED': {
          pipe(this.options, O.some, O.map((x) => O.isSome(x)
            ? pipe(x, H.prop('value'), H.prop('updateCurrents'), H.call([action.currents]))
            : O.none
          ));

          break;
        }

        case 'STEP_UPDATED': {
          pipe(this.options, O.some, O.map((x) => O.isSome(x)
            ? pipe(x, H.prop('value'), H.prop('updateStep'), H.call([action.step]))
            : O.none
          ));

          break;
        }

        case 'RANGE_UPDATED': {
          pipe(this.options, O.some, O.map((x) => O.isSome(x)
            ? pipe(x, H.prop('value'), H.prop('updateRange'), H.call([action.range]))
            : O.none
          ));

          break;
        }

        case 'MARGIN_UPDATED': {
          pipe(this.options, O.some, O.map((x) => O.isSome(x)
            ? pipe(x, H.prop('value'), H.prop('updateMargin'), H.call([action.margin]))
            : O.none
          ));

          break;
        }
      }
    }
  };
}

export default Example;