import {pipe} from 'fp-ts/function';
import * as H from 'helpers/index';

import 'view-elements/tooltip/style-core.css';
import 'view-elements/tooltip/style-theme.css';
import Namespace from 'view-elements/tooltip/namespace';

class Tooltip implements Namespace.Interface {
  public readonly node;

  public readonly setValue = (value: number) => {
    pipe(value, H.toString, H.setInnerText)(this.node);

    return (this);
  };

  constructor(private readonly props: Namespace.Props) {
    this.node = this.render();
  }

  private readonly render = () => {
    const {orientation, alwaysShown, bemBlockClassName} = this.props;

    const classList = [
      'pure-slider__tooltip',
      `pure-slider__tooltip_orientation_${orientation}`,
      ...(alwaysShown ? ['pure-slider__tooltip_shown'] : []),
      ...(bemBlockClassName ? [
        `${bemBlockClassName}__tooltip`,
        `${bemBlockClassName}__tooltip_orientation_${orientation}`
      ] : [])
    ];

    return (pipe(H.node('span'), H.addClassList(classList)));
  };
}

export default Tooltip;