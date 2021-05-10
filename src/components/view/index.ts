import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import {constant, pipe} from 'fp-ts/function';

import * as H from '../../globals/helpers';

import View from './namespace';
import * as Connect from './connect';
import './styles.css';

export default class implements View.Interface {
  public props: View.Props = {
    container: document.createElement('div'),
    min: 0,
    max: 10,
    currents: [5],
    intervals: [false, false],
    orientation: 'horizontal',
    tooltipOptions: {
      enabled: false,
      alwaysShown: false
    },
    customBlockClassName: 'default-themed-slider',
    onDragHandler: (i: number, coord: number) => console.log(i, coord)
  };

  private connectsMap: View.ConnectMap[] = [];

  private base: HTMLDivElement = document.createElement('div');

  private range: number = H.sub(H.prop('min')(this.props))(H.prop('max')(this.props));

  public setProps(props: View.Props) {
    this.props = props;
  }

  public render() {
    const {container} = this.props;

    H.addClassList(['pure-slider'])(container);

    this.renderBase();
    this.renderConnects();
  }

  public destroy() {
    const {container} = this.props;

    container.innerHTML = '';

    H.removeClassList(['pure-slider'])(container);
  }

  public updateCurrents(currents: View.Props['currents']) {
    const {orientation} = this.props;

    this.props = {...this.props, currents};

    A.map(({node, index}: View.ConnectMap) => Connect.move({
      orientation, ...this.getConnectConfig(index)
    })(node))(this.connectsMap);
  }

  private percentToRange = (x: number): number => H.percent(this.range)(x);

  private correctToMin = (x: number): number => H.sub(H.prop('min')(this.props))(x);

  private getConnectConfig = (i: number): { size: number, translate: number } => {
    const {currents, intervals} = this.props;

    switch (i) {
      case 0:
        return ({
          size: pipe(currents[0], this.correctToMin, this.percentToRange),
          translate: 0
        });
      case pipe(intervals, A.size, H.dec):
        return ({
          size: pipe(H.sub(
            pipe(currents, A.last, O.getOrElse(constant(0)))
          )(this.range), this.correctToMin, this.percentToRange),
          translate: pipe(currents, A.last, O.getOrElse(constant(0)), this.correctToMin, this.percentToRange)
        });
      default:
        return ({
          size: pipe(H.sub(
            pipe(currents, A.lookup(H.dec(i)), O.getOrElse(constant(0)))
          )(
            pipe(currents, A.lookup(i), O.getOrElse(constant(0)))
          ), this.correctToMin, this.percentToRange),
          translate: pipe(currents, A.lookup(H.dec(i)), O.getOrElse(constant(0)), this.correctToMin, this.percentToRange)
        });
    }
  };

  private getClassList = (key: View.NodeKeys): string[] => {
    const {customBlockClassName, orientation} = this.props;

    return ([
      `pure-slider__${key}`,
      `pure-slider__${key}_orientation_${orientation}`,
      ...(customBlockClassName !== undefined ? [
        `${customBlockClassName}__${key}`,
        `${customBlockClassName}__${key}_orientation_${orientation}`
      ] : [])
    ]);
  };

  private renderBase = () => {
    const {container} = this.props;

    this.base = pipe(
      H.node('div'),
      H.addClassList(this.getClassList('base')),
      H.appendTo(container)
    ) as HTMLDivElement;
  };

  private renderConnects() {
    const {orientation, intervals} = this.props;

    const connectConfigBase = {
      orientation,
      classList: this.getClassList('connect')
    };

    const connect = (i: number) => Connect.render({
      ...connectConfigBase,
      ...this.getConnectConfig(i)
    });

    const intervalsIndexes = A.reduceWithIndex([] as number[], (i, xs, x: boolean) => x ? [...xs, i] : xs)(intervals);

    this.connectsMap = A.map((x: number) => ({
      node: pipe(x, connect, H.appendTo(this.base)),
      index: x
    }))(intervalsIndexes);
  }
}



