import * as O from 'fp-ts/Option';
import {constant, pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Fragment from '../fragment';

import Namespace from './namespace';
import template from './index.html';
import './style.css';

Fragment.injectTemplate(template);

class TextField extends Fragment implements Namespace.Interface {
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
    super(parent,'#js-text-field', '.js-text-field');

    pipe(this.textFieldMap, this.render);
  }

  private readonly textFieldMap = (x: HTMLElement) => pipe(
    x,
    this.renderInput,
    this.setLabel
  );

  private input: O.Option<HTMLInputElement> = O.none;

  private readonly renderInput = (x: HTMLElement) => pipe(
    x,
    H.querySelector('.js-text-field__input'),
    (x) => {
      this.input = x as O.Option<HTMLInputElement>;

      return (x);
    },
    O.some,
    O.map((x) => O.isSome(x)
      ? pipe(
        x,
        H.prop('value'),
        H.addEventListener('change', () => pipe(
          x as O.Some<HTMLInputElement>,
          H.prop('value'),
          H.prop('value'),
          Number,
          this.props.onChange
        )))
      : O.none),
    () => x,
  );

  private readonly setLabel: Namespace.SetLabel = (x) => {
    const {label} = this.props;

    pipe(x, H.querySelector('.js-text-field__label'), O.some, O.map((x) => O.isSome(x)
      ? pipe(x, H.prop('value'), (x) => x.innerText = label)
      : O.none));

    return (x);
  };
}

export default TextField;