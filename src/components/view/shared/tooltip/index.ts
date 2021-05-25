import {pipe} from 'fp-ts/function';

import * as H from '../../../../helpers';

import Element from '../element';

import Namespace from './namespace';

class Tooltip extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Tooltip(props);

  public readonly setValue: Namespace.SetValue = (value) => {
    pipe(this.node, pipe(value, H.toString, H.setInnerText));
  }

  private constructor(props: Namespace.Props) {
    super(props, H.node('span'), 'tooltip');

    this.setTooltipVisibility();
  }

  private readonly setTooltipVisibility = () => {
    const {bemBlockClassName, alwaysShown} = this.props;

    const {base, theme} = bemBlockClassName;

    pipe(this.node, H.addClassList([
      ...(alwaysShown ? [`${base}__tooltip_shown`] : []),
      ...(alwaysShown ? [`${theme}__tooltip_shown`] : [])
    ]));
  };
}

export default Tooltip;