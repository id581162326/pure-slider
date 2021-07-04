import * as H from 'helpers';
import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as NEA from 'fp-ts/NonEmptyArray';

import Namespace from 'view-managers/data/namespace';

class DataManager<Props extends Namespace.Props> {
  constructor(protected readonly props: Props) {}

  protected readonly pxToNum = (px: number) => {
    const {container, range, orientation} = this.props;

    const containerSize = pipe(orientation, H.switchCases([
      ['horizontal', F.constant(container.offsetWidth)],
      ['vertical', F.constant(container.offsetHeight)]
    ], F.constant(NaN)));

    const rangeSize = H.subAdjacent(1)(range);

    return pipe(px, H.percentage(containerSize), H.mult(rangeSize), Math.round);
  };

  protected readonly percentOfRange = (num: number) => {
    const {range} = this.props;

    const rangeValue = pipe(range, H.subAdjacent(1));

    return (pipe(num, H.percentage(rangeValue)));
  };

  protected readonly correctToMin = (num: number) => {
    const {range} = this.props;

    const min = pipe(range, NEA.head);

    return (H.sub(min)(num));
  };
}

export default DataManager;