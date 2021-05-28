import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Fragment from '../fragment';

import Namespace from './namespace';
import exampleTemplate from './index.html';
import './style.css';

pipe(document, H.querySelector('html'), O.some, O.map((x) => O.isSome(x)
  ? x.value.insertAdjacentHTML('afterbegin', exampleTemplate)
  : O.none)
);

class Button extends Fragment implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Button(props, parent);

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, 'js-button');

    pipe(this.buttonMap, this.render);
  }

  private readonly buttonMap = (x: O.Some<HTMLElement>) => pipe(
    x,
    H.prop('value'),
    H.addEventListener('click', this.props.onClick),
    H.setInnerText(this.props.label),
    O.some
  );
}

export default Button;