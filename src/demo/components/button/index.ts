import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Fragment from '../fragment';

import Namespace from './namespace';
import template from './index.html';
import './style.css';

Fragment.injectTemplate(template);

class Button extends Fragment <HTMLButtonElement> implements Namespace.Interface {
  static readonly of: Namespace.Of = (props) => (parent) => new Button(props, parent);

  private constructor(private readonly props: Namespace.Props, parent: Namespace.Parent) {
    super(parent, '#js-button', '.js-button');

    pipe(this.mapButton, this.render);
  }

  private readonly mapButton: Namespace.MapButton = (buttonNode) => pipe(
    buttonNode,
    H.addEventListener('click', this.props.onClick),
    H.setInnerText(this.props.label)
  );
}

export default Button;