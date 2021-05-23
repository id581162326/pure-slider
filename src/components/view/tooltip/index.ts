import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import AbstractElement from '../abstract-element';

import Namespace from './namespace';

class Tooltip extends AbstractElement<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Tooltip(props);

  public readonly moveTo: Namespace.MoveTo = (currents) => {
    const value = this.getValue(currents);

    pipe(this.node, H.setInnerText(value));
  }

  protected readonly setClassList = () => {
    const {orientation, bemBlockClassName, alwaysShown} = this.props;

    const {base, theme} = bemBlockClassName;

    pipe(this.node, H.addClassList([
      `${base}__tooltip`,
      `${base}__tooltip_orientation_${orientation}`,
      ...(alwaysShown ? [`${base}__tooltip_shown`] : []),
      `${theme}__tooltip`,
      `${theme}__tooltip_orientation_${orientation}`,
      ...(alwaysShown ? [`${theme}__tooltip_shown`] : [])
    ]));
  };

  private constructor(props: Namespace.Props) {
    super(props, H.node('span'));

    this.setClassList();
  }

  private readonly getValue: Namespace.GetValue = (currents) => {
    const {type} = this.props;

    const value = pipe(currents, type === 'single' || type === 'start' ? NEA.head : NEA.last, H.toString);

    return (value);
  };
}

export default Tooltip;