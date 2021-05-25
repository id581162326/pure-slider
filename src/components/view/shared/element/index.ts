import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../helpers';

import Namespace from './namespace';

class Element<Props extends Namespace.Props, Node extends Namespace.Node> implements Namespace.Interface {
  public readonly getNode: Namespace.GetNode<Node> = () => this.node;

  public readonly destroy: Namespace.Destroy = () => this.node.remove();

  public readonly toggleOrientation: Namespace.ToggleOrientation = () => {
    const {orientation, bemBlockClassName} = this.props;

    this.props.orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';

    const {base, theme} = bemBlockClassName;

    const horizontalClassList = this.key === 'container' ? [
      `${base}_orientation_horizontal`,
      `${theme}_orientation_horizontal`
    ] : [
      `${base}__${this.key}_orientation_horizontal`,
      `${theme}__${this.key}_orientation_horizontal`
    ];

    const verticalClassList = this.key === 'container' ? [
      `${base}_orientation_vertical`,
      `${theme}_orientation_vertical`
    ] : [
      `${base}__${this.key}_orientation_vertical`,
      `${theme}__${this.key}_orientation_vertical`
    ];

    pipe(this.node, H.toggleClassList(horizontalClassList), H.toggleClassList(verticalClassList));
  };

  protected readonly setClassList: Namespace.SetClassList = () => {
    const {bemBlockClassName, orientation} = this.props;

    const {base, theme} = bemBlockClassName;

    pipe(this.node, H.addClassList(this.key === 'container' ? [
      `${base}`,
      `${base}_orientation_${orientation}`,
      `${theme}`,
      `${theme}_orientation_${orientation}`,
    ] : [
      `${base}__${this.key}`,
      `${base}__${this.key}_orientation_${orientation}`,
      `${theme}__${this.key}`,
      `${theme}__${this.key}_orientation_${orientation}`,
    ]));
  };

  protected constructor(protected readonly props: Props, protected readonly node: Node, protected readonly key: Namespace.NodeKeys) {
    this.setClassList();
  };

  protected readonly pxToNum: Namespace.PxToNum = (px) => {
    const {container, range} = this.props;

    const containerSize = pipe(container, this.nodeSize);

    const rangeValue = H.subAdjacent(1)(range);

    return pipe(px, H.mult(rangeValue), H.div(containerSize), Math.round);
  };

  protected readonly correctToMin: Namespace.CorrectToMin = (x) => {
    const {range} = this.props;

    const min = pipe(range, NEA.head);

    return (H.sub(min)(x));
  };

  protected readonly percentOfRange: Namespace.PercentOfRange = (x) => {
    const {range} = this.props;

    const rangeValue = pipe(range, H.subAdjacent(1));

    return (pipe(x, H.percent(rangeValue)));
  };

  protected readonly nodeSize: Namespace.NodeSize = (node) => {
    const {orientation} = this.props;

    return (orientation === 'horizontal' ? H.offsetWidth(node) : H.offsetHeight(node));
  };
}

export default Element;