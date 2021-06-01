import * as O from 'fp-ts/Option';
import {constant, pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Fragment from '../fragment';

import Namespace from './namespace';
import template from './index.html';
import './style.css';

Fragment.injectTemplate(template);

class TextField extends Fragment <HTMLLabelElement> implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new TextField(props, parent);

  public readonly getValue = () => pipe(this.input, O.some, O.map((x) => O.isSome(x)
    ? pipe(x, H.prop('value'), H.prop('value'), Number)
    : NaN
  ), O.getOrElse(constant(NaN)));

  public readonly setValue = (value: number) => pipe(this.input, O.some, O.map((x) => O.isSome(x)
    ? pipe(x, H.prop('value')).value = pipe(value, H.toString)
    : O.none
  ));

  public readonly setStep = (step: number) => pipe(this.input, O.some, O.map((x) => O.isSome(x)
    ? pipe(x, H.prop('value')).step = pipe(step, H.toString)
    : O.none
  ));

  constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, '#js-text-field', '.js-text-field');

    pipe(this.mapTextField, this.render);
  }

  private readonly mapTextField: Namespace.MapTextField = (textFieldNode) => pipe(
    textFieldNode,
    this.renderInput,
    this.setLabel
  );

  private input: O.Option<HTMLInputElement> = O.none;

  private readonly renderInput: Namespace.MapTextField = (textFieldNode) => pipe(
    textFieldNode,
    H.querySelector('.js-text-field__input'),
    (inputNode) => {
      this.input = inputNode as O.Option<HTMLInputElement>;

      return (inputNode);
    },
    O.some,
    O.map((inputNode) => O.isSome(inputNode)
      ? pipe(inputNode, H.prop('value'), H.addEventListener('change', () => pipe(
        inputNode as O.Some<HTMLInputElement>,
        H.prop('value'),
        H.prop('value'),
        Number,
        this.props.onChange
      ))) : O.none),
    () => textFieldNode,
  );

  private readonly setLabel: Namespace.MapTextField = (textFieldNode) => {
    const {label} = this.props;

    pipe(textFieldNode, H.querySelector('.js-text-field__label'), O.some, O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), (x) => x.innerText = label)
      : O.none));

    return (textFieldNode);
  };
}

export default TextField;