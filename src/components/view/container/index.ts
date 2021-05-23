import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import AbstractElement from '../abstract-element';

import Namespace from './namespace';

class Container extends AbstractElement<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Container(props);

  protected readonly setClassList = () => {
    const {orientation, bemBlockClassName} = this.props;

    const {base, theme} = bemBlockClassName;

    pipe(this.node, H.addClassList([
      `${base}`,
      `${base}_orientation_${orientation}`,
      `${theme}`,
      `${theme}_orientation_${orientation}`
    ]))
  };

  private constructor(props: Namespace.Props) {
    super(props, pipe(props, H.prop('container')));

    this.setClassList();
  }
}

export default Container;