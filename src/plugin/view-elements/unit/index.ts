import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as H from 'helpers/index';

import 'view-elements/unit/style-core.css';
import 'view-elements/unit/style-theme.css';
import Namespace from 'view-elements/unit/namespace';

class Unit implements Namespace.Interface {
  public readonly node;

  public readonly setActive = (active: boolean) => {
    const activeClassList = [
      'pure-slider__unit_active',
      ...(this.props.bemBlockClassName ? [
        `${this.props.bemBlockClassName}__unit_active`
      ] : [])
    ];

    pipe(active, H.switchCases([
      [true, () => H.addClassList(activeClassList)(this.node)],
      [false, () => H.removeClassList(activeClassList)(this.node)]
    ], F.constVoid));

    return (this);
  };

  constructor(private readonly props: Namespace.Props) {
    this.node = this.render();
  }

  private readonly render = () => {
    const {orientation, bemBlockClassName, showValue} = this.props;

    const classList = [
      'pure-slider__unit',
      `pure-slider__unit_orientation_${orientation}`,
      ...(bemBlockClassName ? [
        `${bemBlockClassName}__unit`,
        `${bemBlockClassName}__unit_orientation_${orientation}`
      ] : [])
    ];

    return (pipe(H.node('div'), H.addClassList(classList), showValue ? this.renderValue : H.ident));
  };

  private readonly renderValue = (node: HTMLDivElement) => {
    const {value, bemBlockClassName} = this.props;

    const classList = [
      'pure-slider__unit-value',
      ...(bemBlockClassName ? [
        `${bemBlockClassName}__unit-value`
      ] : [])
    ];

    pipe(H.node('span'), pipe(value, H.toString, H.setInnerText), H.addClassList(classList), H.appendTo(node));

    return (node);
  };
}

export default Unit;