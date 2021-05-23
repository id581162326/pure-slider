import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../helpers';

import Namespace from './namespace';

abstract class AbstractElement<Props extends Namespace.Props, Node extends Namespace.Node> implements Namespace.Interface {
  public readonly getNode: Namespace.GetNode<Node> = () => this.node;

  protected abstract setClassList: Namespace.SetClassList;

  protected constructor(protected readonly props: Props, protected readonly node: Node) {};

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

export default AbstractElement;