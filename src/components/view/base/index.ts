import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import AbstractElement from '../abstract-element';

import Namespace from './namespace';

class Base extends AbstractElement<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Base(props);

  protected readonly setClassList = () => {
    const {orientation, bemBlockClassName} = this.props;

    const {base, theme} = bemBlockClassName;

    pipe(this.node, H.addClassList([
      `${base}__base`,
      `${base}__base_orientation_${orientation}`,
      `${theme}__base`,
      `${theme}__base_orientation_${orientation}`,
    ]));
  }

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'));

    this.setClassList();
  }
}

export default Base;