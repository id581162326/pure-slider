import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Fragment from '../fragment';
import Button from '../button';
import TextField from '../text-field';
import Switcher from '../switcher';

import Namespace from './namespace';
import template from './index.html';
import './style.css';

Fragment.injectTemplate(template);

class Options extends Fragment implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Options(props, parent);

  public readonly updateCurrents = (currents: Namespace.Currents) => pipe(
    this.currentsFields,
    A.mapWithIndex((idx, textField) => textField.setValue(pipe(currents, H.nthOrNone(idx, 0))))
  );

  public readonly updateRange = (range: Namespace.Range) => pipe(
    this.rangeFields,
    A.mapWithIndex((idx, textField) => textField.setValue(pipe(range, H.nthOrNone(idx, 0))))
  );

  public readonly updateStep = (step: number) => {
    pipe(this.currentsFields, A.map((textField) => textField.setStep(step)));

    pipe(this.stepField, A.map((textField) => textField.setValue(step)));
  };

  public readonly updateMargin = (margin: number) => {
    pipe(this.marginField, A.map((textField) => textField.setValue(margin)));
  };

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, '#js-options','.js-options');

    pipe(this.optionsMap, this.render);
  }

  private readonly currentsFields: Namespace.TextField[] = [];

  private readonly rangeFields: Namespace.TextField[] = [];

  private readonly stepField: Namespace.TextField[] = [];

  private readonly marginField: Namespace.TextField[] = [];

  private optionsMap = (x: HTMLElement) => pipe(
    x,
    this.renderCurrentsFields,
    this.renderRangeFields,
    this.renderStepField,
    this.renderMarginField,
    this.renderOrientationToggle,
    this.renderRangeToggle,
    this.renderTooltipsToggle,
    this.renderScaleToggle,
    this.renderSwitcher
  );

  private renderCurrentsFields: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelectorAll('.js-options__text-field_with_handler'),
    A.mapWithIndex((idx, node) => pipe(
      node,
      TextField.of({
        label: idx === 0 ? '1st handler' : '2nd handler',
        onChange: (x) => this.props.onCurrentsChange([
          idx === 0 ? x : pipe(this.currentsFields, H.nthOrNone(0, {getValue: () => 0}), H.prop('getValue'))(),
          idx === 1 ? x : pipe(this.currentsFields, H.nthOrNone(1, {getValue: () => 0}), H.prop('getValue'))()
        ])
      }), (x) => this.currentsFields.push(x))),
    () => x
  );

  private renderRangeFields: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelectorAll('.js-options__text-field_with_range'),
    A.mapWithIndex((idx, node) => pipe(
      node,
      TextField.of({
        label: idx === 0 ? 'Min' : 'Max',
        onChange: (x) => this.props.onRangeChange([
          idx === 0 ? x : pipe(this.rangeFields, H.nthOrNone(0, {getValue: () => 0}), H.prop('getValue'))(),
          idx === 1 ? x : pipe(this.rangeFields, H.nthOrNone(1, {getValue: () => 0}), H.prop('getValue'))()
        ])
      }), (x) => this.rangeFields.push(x))),
    () => x
  );

  private renderStepField: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelector('.js-options__text-field_with_step'),
    O.some,
    O.map((x) => O.isSome(x) ? pipe(x, H.prop('value'), TextField.of({label: 'Step', onChange: this.props.onStepChange}), (x) => this.stepField.push(x)) : O.none),
    () => x
  );

  private renderMarginField: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelector('.js-options__text-field_with_margin'),
    O.some,
    O.map((x) => O.isSome(x) ? pipe(x, H.prop('value'), TextField.of({label: 'Margin', onChange: this.props.onMarginChange}), (x) => this.marginField.push(x)) : O.none),
    () => x
  );

  private renderOrientationToggle: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelector('.js-options__button_toggle_orientation'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), Button.of({label: 'Toggle orientation', onClick: this.props.onOrientationToggle}))
      : O.none
    ),
    () => x
  );

  private renderScaleToggle: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelector('.js-options__button_toggle_scale'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), Button.of({label: 'Toggle scale', onClick: this.props.onScaleToggle}))
      : O.none
    ),
    () => x
  );

  private renderTooltipsToggle: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelector('.js-options__button_toggle_tooltips'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), Button.of({label: 'Toggle tooltips', onClick: this.props.onTooltipsToggle}))
      : O.none
    ),
    () => x
  );

  private renderRangeToggle: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelector('.js-options__button_toggle_range'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), Button.of({label: 'Toggle range', onClick: this.props.onRangeToggle}))
      : O.none
    ),
    () => x
  );

  private renderSwitcher: (x: HTMLElement) => HTMLElement = (x) => pipe(
    x,
    H.querySelector('.js-options__switcher'),
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), Switcher.of({
        label: 'Interval type switcher',
        onChange: this.handleConnectSwitcherChange
      }))
      : O.none),
    () => x
  );

  private handleConnectSwitcherChange = (x: number) => this.props.onConnectTypeChange(x === 1
    ? 'from-start' : x === 2
      ? 'to-end' : x === 3
        ? 'inner-range' : x === 4
          ? 'outer-range' : 'none');
}

export default Options;