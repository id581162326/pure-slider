import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Slider from '../../../plugin/slider';

import Fragment from '../fragment';
import Options from '../options';

import Namespace from './namespace';
import exampleTemplate from './index.html';
import './style.css';

pipe(document, H.querySelector('html'), O.some, O.map((x) => O.isSome(x)
  ? x.value.insertAdjacentHTML('afterbegin', exampleTemplate)
  : O.none)
);

class Example extends Fragment implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Example(props, parent);

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, 'js-example');

    this.slider = this.renderSlider();

    pipe(this.exampleMap, this.render);

    this.attachOptionListener();
  }

  private readonly slider: O.Option<Namespace.Slider>;

  private options: O.Option<Namespace.Options> = O.none;

  private readonly exampleMap = (x: O.Some<HTMLElement>) => pipe(
    x as O.Some<HTMLElement>,
    H.prop('value'),
    this.setInnerText,
    this.renderOptions,
    O.some
  );

  private readonly renderOptions: Namespace.RenderOptions = (x) => pipe(
    x,
    H.querySelector('.js-example__options'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), Options.of({
        onConnectTypeChange: this.handleConnectTypeChanged,
        onCurrentsChange: this.handleCurrentsChange,
        onStepChange: this.handleStepChange,
        onMarginChange: this.handleMarginChange,
        onRangeChange: this.handleRangeChange,
        onOrientationToggle: this.handleOrientationToggle,
        onScaleToggle: this.handleScaleToggle,
        onTooltipsToggle: this.handleTooltipToggle,
        onRangeToggle: this.handleRangeToggle
      }), (x) => this.options = O.some(x))
      : O.none),
    () => x
  );

  private readonly handleOrientationToggle = () => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).toggleOrientation()
      : O.none)
  );

  private readonly handleTooltipToggle = () => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).toggleTooltips()
      : O.none)
  );

  private readonly handleScaleToggle = () => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).toggleScale()
      : O.none)
  );

  private readonly handleRangeToggle = () => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).toggleRange()
      : O.none)
  );

  private readonly handleConnectTypeChanged: Namespace.HandleConnectTypeChanged = (type) => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).setConnectType(type)
      : O.none)
  );

  private readonly handleCurrentsChange = (currents: [number, number]) => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).updateCurrents(currents)
      : O.none)
  );

  private readonly handleRangeChange = (range: [number, number]) => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).updateRange(range)
      : O.none)
  );

  private readonly handleStepChange = (step: number) => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).updateStep(step)
      : O.none)
  );

  private readonly handleMarginChange = (margin: number) => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value')).updateMargin(margin)
      : O.none)
  );

  private readonly setInnerText: Namespace.SetInnerText = (x) => {
    const {title, description} = this.props;

    pipe(x, H.querySelector('.js-example__title'), O.some, O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), H.setInnerText(title))
      : O.none)
    );

    pipe(x, H.querySelector('.js-example__description'), O.some, O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), H.setInnerText(description))
      : O.none)
    );

    return (x);
  };

  private readonly renderSlider: Namespace.RenderSlider = () => pipe(
    this.parent,
    H.querySelector('.js-example__slider'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x as O.Some<HTMLDivElement>, H.prop('value'), Slider.of, H.call([this.props.sliderConfig]))
      : O.none)
  ) as O.Option<Namespace.Slider>;

  private attachOptionListener = () => pipe(
    this.slider,
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), H.prop('attachListener'), H.call([this.optionsListener]))
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