import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import {constant, pipe} from 'fp-ts/function';

import * as H from '../../globals/helpers';

import View from './namespace';
import './styles.css';
import './theme.css';

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
    customBlockClassName: 'themed-slider',
    onDragHandler: (i: number, coord: number) => console.log(i, coord)
  };

  private connectsMap: View.ConnectMap[] = [];

  private handlersMap: View.HandlerMap[] = [];

  private base: HTMLDivElement = document.createElement('div');

  private range: number = H.sub(H.prop('min')(this.props))(H.prop('max')(this.props));

  public setProps(props: View.Props) {
    this.props = {...this.props, ...props};
  }

  public render() {
    const {container, customBlockClassName} = this.props;

    H.addClassList([
      'pure-slider',
      ...(customBlockClassName !== undefined ? [`${customBlockClassName}`] : [])
    ])(container);

    this.renderBase();
    this.renderConnects();
    this.renderHandlers();
    this.moveNodes();
  }

  public destroy() {
    const {container} = this.props;

    container.innerHTML = '';

    H.removeClassList(['pure-slider'])(container);
  }

  public updateCurrents(currents: View.Props['currents']) {
    this.setProps({...this.props, currents});
    this.moveNodes();
  }

  private percentToRange = H.percent(this.range);

  private correctToMin = H.sub(H.prop('min')(this.props));

  private getConnectDimensions = (i: number): { size: number, translate: number } => {
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
  }

  private getHandlerDimensions = (i: number): { translate: number } => {
    const {currents} = this.props;

    return ({translate: pipe(currents, A.lookup(i), O.getOrElse(constant(0)), this.correctToMin, this.percentToRange)});
  }

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
  }

  private renderBase = () => {
    const {container} = this.props;

    this.base = pipe(
      H.node('div'),
      H.addClassList(this.getClassList('base')),
      H.appendTo(container)
    );
  }

  private renderConnects = () => {
    const {intervals} = this.props;

    const classList = this.getClassList('connect');

    const intervalsIndexes = A.reduceWithIndex([] as number[], (i, xs, x: boolean) => x ? [...xs, i] : xs)(intervals);

    this.connectsMap = A.map((x: number) => ({
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      ),
      id: x
    }))(intervalsIndexes);
  }

  private moveConnect = ({node, id}: View.ConnectMap) => {
    console.log(this);
    const {orientation} = this.props;
    const {translate, size} = this.getConnectDimensions(id);

    switch (orientation) {
      case 'horizontal':
        H.setInlineStyle(`left: ${translate}%; max-width: ${size}%`)(node);
        break;
      case 'vertical':
        H.setInlineStyle(`top: ${translate}%; max-height: ${size}%`)(node);
        break;
    }
  }

  private renderHandlers = () => {
    const {currents} = this.props;

    const classList = this.getClassList('handler');

    this.handlersMap = A.mapWithIndex((i) => ({
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      ),
      id: i
    }))(currents);
  }

  private moveHandler = ({node, id}: View.HandlerMap) => {
    const {orientation} = this.props;
    const {translate} = this.getHandlerDimensions(id);

    switch (orientation) {
      case 'horizontal':
        H.setInlineStyle(`left: calc(${translate}% - ${H.half(H.offsetWidth(node))}px)`)(node);
        break;
      case 'vertical':
        H.setInlineStyle(`top: calc(${translate}% - ${H.half(H.offsetHeight(node))}px)`)(node);
    }
  }

  private moveNodes = () => {
    A.map(this.moveConnect)(this.connectsMap);
    A.map(this.moveHandler)(this.handlersMap);
  }
}



