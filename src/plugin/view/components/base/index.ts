import {pipe} from 'fp-ts/function';
import * as H from 'helpers';

import 'view-components/base/style.core.css';
import 'view-components/base/style.theme.css';
import Namespace from 'view-components/base/namespace';

class Base implements Namespace.Interface {
  public readonly node;

  constructor(private readonly props: Namespace.Props) {
    this.node = this.render();
  }

  private readonly render = () => {
    const {bemBlockClassName, orientation} = this.props;

    const classList = [
      'pure-slider__base',
      `pure-slider__base_orientation_${orientation}`,
      ...(bemBlockClassName ? [
        `${bemBlockClassName}__base`,
        `${bemBlockClassName}__base_orientation_${orientation}`
      ] : [])
    ];

    return (pipe(
      H.node('div'), H.addClassList(classList),
      H.addEventListener('click', this.clickListener)
    ));
  };


  private readonly clickListener = (event: MouseEvent) => {
    const {x, y} = this.node.getBoundingClientRect();

    this.props.onClick({
      x: H.sub(x)(event.x),
      y: H.sub(y)(event.y)
    });
  };
}

export default Base;