import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
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

class Options extends Fragment <HTMLDivElement> implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Options(props, parent);

  public readonly updateCurrents = (currents: Namespace.Currents) => {
    pipe(this.currentsFields, A.mapWithIndex((idx, textField) => textField.setValue(pipe(currents, H.nthOrNone(idx, 0)))));
  };

  public readonly updateRange = (range: Namespace.Range) => {
    pipe(this.rangeFields, A.mapWithIndex((idx, textField) => textField.setValue(pipe(range, H.nthOrNone(idx, 0)))));

    pipe(this.currentsFields, A.map((textField) => pipe(range, NEA.head, textField.setMin)));
  };

  public readonly updateStep = (step: number) => {
    pipe(this.currentsFields, A.map((textField) => textField.setStep(step)));

    pipe(this.stepField, A.map((textField) => textField.setValue(step)));
  };

  public readonly updateMargin = (margin: number) => {
    pipe(this.marginField, A.map((textField) => textField.setValue(margin)));
  };

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, '#js-options', '.js-options');

    pipe(this.mapOptions, this.render);
  }

  private readonly currentsFields: Namespace.TextField[] = [];

  private readonly rangeFields: Namespace.TextField[] = [];

  private readonly stepField: Namespace.TextField[] = [];

  private readonly marginField: Namespace.TextField[] = [];

  private mapOptions: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
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

  private renderCurrentsFields: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelectorAll('.js-options__text-field_with_handler'),
    A.mapWithIndex((idx, node) => pipe(node, TextField.of({
      label: idx === 0 ? '1st handler' : '2nd handler',
      onChange: coord => this.props.onCurrentsChange([
        idx === 0 ? coord : pipe(this.currentsFields, H.nthOrNone(0, {getValue: () => 0}), H.prop('getValue'))(),
        idx === 1 ? coord : pipe(this.currentsFields, H.nthOrNone(1, {getValue: () => 0}), H.prop('getValue'))()
      ])
    }), (textField) => this.currentsFields.push(textField))),
    () => optionsNode
  );

  private renderRangeFields: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelectorAll('.js-options__text-field_with_range'),
    A.mapWithIndex((idx, node) => pipe(node, TextField.of({
      label: idx === 0 ? 'Min' : 'Max',
      onChange: (step) => this.props.onRangeChange([
        idx === 0 ? step : pipe(this.rangeFields, H.nthOrNone(0, {getValue: () => 0}), H.prop('getValue'))(),
        idx === 1 ? step : pipe(this.rangeFields, H.nthOrNone(1, {getValue: () => 0}), H.prop('getValue'))()
      ])
    }), (textField) => this.rangeFields.push(textField))),
    () => optionsNode
  );

  private renderStepField: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelector('.js-options__text-field_with_step'),
    O.some,
    O.map((fieldNode) => O.isSome(fieldNode)
      ? pipe(fieldNode, H.prop('value'), TextField.of({
        label: 'Step',
        onChange: this.props.onStepChange
      }), (textField) => this.stepField.push(textField))
      : O.none),
    () => optionsNode
  );

  private renderMarginField: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelector('.js-options__text-field_with_margin'),
    O.some,
    O.map((fieldNode) => O.isSome(fieldNode)
      ? pipe(fieldNode, H.prop('value'), TextField.of({
        label: 'Margin',
        onChange: this.props.onMarginChange
      }), (textField) => this.marginField.push(textField))
      : O.none),
    () => optionsNode
  );

  private renderOrientationToggle: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelector('.js-options__button_toggle_orientation'),
    O.some,
    O.map((toggleNode) => O.isSome(toggleNode)
      ? pipe(toggleNode, H.prop('value'), Button.of({
        label: 'Toggle orientation',
        onClick: this.props.onOrientationToggle
      })) : O.none),
    () => optionsNode
  );

  private renderScaleToggle: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelector('.js-options__button_toggle_scale'),
    O.some,
    O.map((toggleNode) => O.isSome(toggleNode)
      ? pipe(toggleNode, H.prop('value'), Button.of({
        label: 'Toggle scale',
        onClick: this.props.onScaleToggle
      })) : O.none),
    () => optionsNode
  );

  private renderTooltipsToggle: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelector('.js-options__button_toggle_tooltips'),
    O.some,
    O.map((toggleNode) => O.isSome(toggleNode)
      ? pipe(toggleNode, H.prop('value'), Button.of({
        label: 'Toggle tooltips',
        onClick: this.props.onTooltipsToggle
      })) : O.none
    ),
    () => optionsNode
  );

  private renderRangeToggle: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelector('.js-options__button_toggle_range'),
    O.some,
    O.map((toggleNode) => O.isSome(toggleNode)
      ? pipe(toggleNode, H.prop('value'), Button.of({
        label: 'Toggle range',
        onClick: this.props.onRangeToggle
      })) : O.none
    ),
    () => optionsNode
  );

  private renderSwitcher: Namespace.MapOptions = (optionsNode) => pipe(
    optionsNode,
    H.querySelector('.js-options__switcher'),
    O.some,
    O.map((switcherNode) => O.isSome(switcherNode)
      ? pipe(switcherNode, H.prop('value'), Switcher.of({
        label: 'Interval type switcher',
        onChange: this.handleConnectSwitcherChange
      })) : O.none),
    () => optionsNode
  );

  private handleConnectSwitcherChange = (connectType: number) => this.props.onConnectTypeChange(connectType === 1
    ? 'from-start' : connectType === 2
      ? 'to-end' : connectType === 3
        ? 'inner-range' : connectType === 4
          ? 'outer-range' : 'none');
}

export default Options;