import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as H from 'helpers/index';

import 'view-elements/connect/style.theme.css';
import 'view-elements/connect/style.core.css';
import Namespace from 'view-elements/connect/namespace';

class Connect implements Namespace.Interface {
  public readonly node;

  public readonly moveTo = (pos: number) => {
    const {orientation} = this.props;

    pipe(orientation, H.switchCases([
      ['horizontal', () => pipe(this.node, H.setStyle('left', `${pos}%`))],
      ['vertical', () => pipe(this.node, H.setStyle('bottom', `${pos}%`))]
    ], F.constVoid));

    return (this);
  };

  public readonly sizeTo = (size: number) => {
    const {orientation} = this.props;

    pipe(orientation, H.switchCases([
      ['horizontal', () => pipe(this.node, H.setStyle('maxWidth', `${size}%`))],
      ['vertical', () => pipe(this.node, H.setStyle('maxHeight', `${size}%`))]
    ], F.constVoid));

    return (this);
  };

  constructor(private readonly props: Namespace.Props) {
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
}


export default Connect;