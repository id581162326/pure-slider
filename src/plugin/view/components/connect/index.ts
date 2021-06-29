import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as H from 'helpers/index';

import 'view-components/connect/style.theme.css';
import 'view-components/connect/style.core.css';
import Namespace from 'view-components/connect/namespace';

class Connect implements Namespace.Interface {
  public readonly moveTo = (pos: number, size: number) => {
    const {orientation} = this.props;

    pipe(orientation, H.switchCases([
      ['horizontal', () => this.setLeftAndMaxWidth(pos, size)],
      ['vertical', () => this.setBottomAndMaxHeight(pos, size)]
    ], F.constVoid));
  };

  public readonly node;

  constructor(public readonly props: Namespace.Props) {
    this.node = this.render();
  }

  private readonly render = () => {
    const {orientation, bemBlockClassName} = this.props;

    const classList = [
      'pure-slider__connect',
      `pure-slider__connect_orientation_${orientation}`,
      ...(bemBlockClassName ? [
        `${bemBlockClassName}__connect`,
        `${bemBlockClassName}__connect_orientation_${orientation}`
      ] : [])
    ];

    return (pipe(H.node('div'), H.addClassList(classList)));
  };

  private readonly setLeftAndMaxWidth = (pos: number, size: number) => {
    pipe(this.node, H.setInlineStyle(`left: ${pos}%; max-width: ${size}%`));
  };

  private readonly setBottomAndMaxHeight = (pos: number, size: number) => {
    pipe(this.node, H.setInlineStyle(`bottom: ${pos}%; max-height: ${size}%`));
  };
}

export default Connect;