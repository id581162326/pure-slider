import * as H from '../../../helpers';

import Element from '../shared/element';

import Namespace from './namespace';

class Base extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Base(props);

  private constructor(props: Namespace.Props) {
    super(props, H.node('div'), 'base');
  }
}

export default Base;