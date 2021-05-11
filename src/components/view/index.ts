import * as A from 'fp-ts/Array';
import {flow, pipe} from 'fp-ts/function';

import * as H from '../../globals/helpers';

import View from './namespace';
import defaultProps from './default';
import './styles.css';
import './theme.css';

export default class implements View.Interface {
  public props: View.Props = defaultProps;

  public setProps(props: View.Props) {
    this.props = {...this.props, ...props};

    console.log(this.props);
  }

  public render: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    H.addClassList([
      'pure-slider-base',
      `${bemBlockClassName}`
    ])(container);

    this.renderNodes();
    this.updateNodes();
    this.initEventListeners();
  };

  public destroy: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    container.innerHTML = '';

    H.removeClassList([
      'pure-slider-base',
      `${bemBlockClassName}`
    ])(container);
  };

  public updateCurrents: (xs: View.Props['currents']) => void = (currents) => {
    this.setProps({...this.props, currents});
    this.updateNodes();
  };

  private connectsMap: View.NodeMap[] = [];

  private handlersMap: View.NodeMap[] = [];

  private tooltipsMap: View.NodeMap[] = [];

  private base: HTMLDivElement = document.createElement('div');

  private range: () => number = () => H.sub(this.props.min)(this.props.max);

  private percentOfRange: (x: number) => number = (x) => pipe(x, H.percent(this.range()));

  private pxToNum: (x: number) => number = (x) => {
    const {orientation, container} = this.props;

    switch (orientation) {
      case 'horizontal':
        return pipe(x, H.mult(this.range()), H.div(pipe(container, H.offsetWidth)), H.ceil);
      case 'vertical':
        return pipe(x, H.mult(this.range()), H.div(pipe(container, H.offsetHeight)), H.ceil);
    }
  };

  private correctToMin: (x: number) => number = (x) => pipe(x, H.sub(this.props.min));

  private getClassList: (k: View.NodeKeys) => string[] = (key) => {
    const {bemBlockClassName, orientation} = this.props;

    return ([
      `pure-slider-base__${key}`,
      `pure-slider-base__${key}_orientation_${orientation}`,
      `${bemBlockClassName}__${key}`,
      `${bemBlockClassName}__${key}_orientation_${orientation}`
    ]);
  };

  private getConnectDimensions: (i: number) => { size: number, pos: number } = (i) => {
    const {currents, intervals} = this.props;

    switch (i) {
      case 0:
        return ({
          size: pipe(currents, H.headOrNone(0), this.correctToMin, this.percentOfRange),
          pos: 0
        });
      case pipe(intervals, A.size, H.dec):
        return ({
          size: flow(this.range, H.sub(pipe(currents, H.lastOrNone(0), this.correctToMin)), this.percentOfRange)(),
          pos: pipe(currents, H.lastOrNone(0), this.correctToMin, this.percentOfRange)
        });
      default:
        return ({
          size: pipe(
            H.sub(pipe(currents, H.nthOrNone(H.dec(i), 0)))(pipe(currents, H.nthOrNone(i, 0))),
            this.correctToMin,
            this.percentOfRange
          ),
          pos: pipe(currents, H.nthOrNone(H.dec(i), 0), this.correctToMin, this.percentOfRange)
        });
    }
  };

  private getHandlerDimensions: (i: number) => { pos: number } = (i) => {
    const {currents} = this.props;

    return ({pos: pipe(currents, H.nthOrNone(i, 0), this.correctToMin, this.percentOfRange)});
  };

  private renderBase: () => void = () => {
    const {container} = this.props;

    this.base = pipe(
      H.node('div'),
      H.addClassList(this.getClassList('base')),
      H.appendTo(container)
    );
  };

  private renderConnects: () => void = () => {
    const {intervals} = this.props;

    const classList = this.getClassList('connect');

    const intervalsIndexes = A.reduceWithIndex([] as number[], (i, xs, x: boolean) => x ? [...xs, i] : xs)(intervals);

    this.connectsMap = A.map((x: number) => ({
      id: x,
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      )
    }))(intervalsIndexes);
  };

  private renderHandlers: () => void = () => {
    const {currents} = this.props;

    const classList = this.getClassList('handler');

    this.handlersMap = A.mapWithIndex((i) => ({
      id: i,
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      )
    }))(currents);
  };

  private renderTooltips: () => void = () => {
    const classList = this.getClassList('tooltip');

    this.tooltipsMap = A.map((x: View.NodeMap) => ({
      id: x.id,
      node: pipe(H.node('span'), H.addClassList(classList), H.appendTo(x.node))
    }))(this.handlersMap);
  };

  private renderNodes: () => void = () => {
    this.renderBase();
    this.renderConnects();
    this.renderHandlers();
    this.renderTooltips();
  };

  private updateConnect: (o: View.NodeMap) => void = ({id, node}) => {
    const {orientation} = this.props;
    const {pos, size} = this.getConnectDimensions(id);

    switch (orientation) {
      case 'horizontal':
        H.setInlineStyle(`left: ${pos}%; max-width: ${size}%;`)(node);
        break;
      case 'vertical':
        H.setInlineStyle(`top: ${pos}%; max-height: ${size}%;`)(node);
        break;
    }
  };

  private updateHandler: (o: View.NodeMap) => void = ({id, node}) => {
    const {orientation} = this.props;
    const {pos} = this.getHandlerDimensions(id);

    switch (orientation) {
      case 'horizontal':
        H.setInlineStyle(`left: calc(${pos}% - ${pipe(node, H.offsetWidth, H.half)}px);`)(node);
        break;
      case 'vertical':
        H.setInlineStyle(`top: calc(${pos}% - ${pipe(node, H.offsetHeight, H.half)}px);`)(node);
        break;
    }
  };

  private updateTooltip: (o: View.NodeMap) => void = ({id, node}) => {
    const {currents} = this.props;

    pipe(node, H.setInnerText(pipe(currents, H.nthOrNone(id, 0), H.toString)));
  };

  private updateNodes: () => void = () => {
    A.map(this.updateConnect)(this.connectsMap);
    A.map(this.updateHandler)(this.handlersMap);
    A.map(this.updateTooltip)(this.tooltipsMap);
  };

  private onDragHandler: (i: number) => (x: number) => void = (index) => (coord) => {
    const {onDragHandler} = this.props;

    onDragHandler(index, coord);
  };

  private getDragListener: (i: number, n: HTMLDivElement) => (e: MouseEvent) => void = (i, n) => ({x, y}) => {
    const {orientation, currents} = this.props;

    switch (orientation) {
      case 'horizontal':
        pipe(currents, H.nthOrNone(i, 0), H.add(pipe(x, H.sub(n.getBoundingClientRect().x), this.pxToNum)), this.onDragHandler(i));
        break;
      case 'vertical':
        pipe(currents, H.nthOrNone(i, 0), H.add(pipe(y, H.sub(n.getBoundingClientRect().y), this.pxToNum)), this.onDragHandler(i));
        break;
    }
  };

  private addDragListener: (o: View.NodeMap) => void = ({id, node}) => {
    const listener = this.getDragListener(id, node as HTMLDivElement);

    H.addEventListener('mousedown', () => H.addEventListener('mousemove', listener)(window))(node);
    H.addEventListener('mouseup', () => H.removeEventListener('mousemove', listener)(window))(window);
  };

  private initEventListeners: () => void = () => {
    A.map(this.addDragListener)(this.handlersMap);
  };
}



