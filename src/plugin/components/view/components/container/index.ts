import Element from '../element';

import Namespace from './namespace';

class Container extends Element<Namespace.Props, Namespace.Node> {
  static readonly of: Namespace.Of = (props) => new Container(props);

  private constructor(props: Namespace.Props) {
    super(props, props.container, 'container');
  }
}

export default Container;