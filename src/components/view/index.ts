import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../globals/helpers';

import View from './namespace';
import * as d from './defaults';
import './styles.css';
import './theme.css';

export default class implements View.Interface {
  public props: View.Props = d.defaultProps;

  public state: View.State = d.defaultState;

  // methods

  public setProps(props: View.Props) {
    this.props = {...this.props, ...props};
  }

  public setState(state: View.State) {
    this.state = state;
  }

  public render() {
    this.renderContainer();
    this.renderNodes();
    this.updateNodes();
    this.initEventListeners();
  };

  public destroy() {
    this.removeEventListeners();
    this.clearListenersStore();
    this.clearContainer();
  };

  public updateState(action: View.StateActions) {
    switch (action.type) {
      case 'UPDATE_HANDLERS_POSITION':
        this.updateHandlersPosition(action.currents);
    }
  };

  // variables

  private connectsMap: View.NodeMap[] = [];

  private handlersMap: View.NodeMap[] = [];

  private tooltipsMap: View.NodeMap[] = [];

  private base: HTMLDivElement = H.node('div');

  // helpers

  private range: () => number = () => pipe(this.props.max, H.sub(this.props.min));

  private percentOfRange: (x: number) => number = (x) => pipe(x, H.percent(this.range()));

  private pxToNum: (x: number) => number = (px) => {
    const {orientation, container} = this.props;

    switch (orientation) {
      case 'horizontal':
        return pipe(px, H.mult(this.range()), H.div(pipe(container, H.offsetWidth)), H.round);
      case 'vertical':
        return pipe(px, H.mult(this.range()), H.div(pipe(container, H.offsetHeight)), H.round);
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

  private getConnectDimensions: (i: number) => { size: number, pos: number } = (id) => {
    const {intervals} = this.props;

    const {currents} = this.state;

    const dimensionsForFirst = () => {
      const first = pipe(currents, H.headOrNone(0), this.correctToMin);

      return ({
        size: pipe(first, this.percentOfRange),
        pos: 0
      });
    };

    const dimensionsForLast = () => {
      const last = pipe(currents, H.lastOrNone(NaN), this.correctToMin);

      return ({
        size: pipe(this.range(), H.sub(last), this.percentOfRange),
        pos: pipe(last, this.percentOfRange)
      });
    };

    const dimensionsForInner = () => {
      const current = pipe(currents, H.nthOrNone(id, NaN), this.correctToMin);

      const prev = pipe(currents, H.nthOrNone(H.dec(id), NaN), this.correctToMin);

      return ({
        size: pipe(current, H.sub(prev), this.percentOfRange),
        pos: pipe(prev, this.percentOfRange)
      });
    };

    switch (id) {
      case 0:
        return (dimensionsForFirst());

      case pipe(intervals, A.size, H.dec):
        return (dimensionsForLast());

      default:
        return (dimensionsForInner());
    }
  };

  private getHandlerDimensions: (i: number) => { pos: number } = (id) => {
    const {currents} = this.state;

    return ({pos: pipe(currents, H.nthOrNone(id, NaN), this.correctToMin, this.percentOfRange)});
  };

  // render logic

  private renderNodes: () => void = () => {
    this.renderBase();
    this.renderConnects();
    this.renderHandlers();
    this.renderTooltips();
  };

  private renderContainer: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    H.addClassList([
      'pure-slider-base',
      `${bemBlockClassName}`
    ])(container);
  };

  private renderBase: () => void = () => {
    const {container} = this.props;

    this.base = pipe(H.node('div'), H.addClassList(this.getClassList('base')), H.appendTo(container));
  };

  private renderConnects: () => void = () => {
    const {intervals} = this.props;

    const classList = this.getClassList('connect');

    const hasIntervalReducer: (i: number, xs: number[], x: boolean) => number[] = (i, xs, x) => x ? [...xs, i] : xs;

    const intervalsIndexes = A.reduceWithIndex([] as number[], hasIntervalReducer)(intervals);

    const setConnectMap: (x: number) => View.NodeMap = (id) => ({
      id,
      node: pipe(H.node('div'), H.addClassList(classList), H.appendTo(this.base))
    });

    this.connectsMap = A.map(setConnectMap)(intervalsIndexes);
  };

  private renderHandlers: () => void = () => {
    const {currents} = this.state;

    const classList = this.getClassList('handler');

    const setHandlerMap: (i: number) => View.NodeMap = (id: number) => ({
      id,
      node: pipe(H.node('div'), H.addClassList(classList), H.appendTo(this.base))
    });

    this.handlersMap = A.mapWithIndex(setHandlerMap)(currents);
  };

  private renderTooltips: () => void = () => {
    const classList = this.getClassList('tooltip');

    const setTooltipMap: (o: View.NodeMap) => View.NodeMap = ({id, node}) => ({
      id,
      node: pipe(H.node('span'), H.addClassList(classList), H.appendTo(node))
    });

    this.tooltipsMap = A.map(setTooltipMap)(this.handlersMap);
  };

  // update logic

  private updateHandlersPosition: (xs: View.State['currents']) => void = (currents) => {
    this.state = {...this.state, currents};

    this.updateNodes();
  };

  private updateNodes: () => void = () => {
    A.map(this.updateConnect)(this.connectsMap);
    A.map(this.updateHandler)(this.handlersMap);
    A.map(this.updateTooltip)(this.tooltipsMap);
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
    const {currents} = this.state;

    pipe(node, H.setInnerText(pipe(currents, H.nthOrNone(id, NaN), H.toString)));
  };

  // event listeners logic

  private listenersStore: View.ListenersStore = {
    startDragListener: [],
    stopDragListener: []
  };

  private onClick: (x: number) => void = (coord) => {
    const {onChange} = this.props;

    const {currents} = this.state;

    const setCurrent: (i: number, x: number) => number = (i, x) => {
      const deltaCurrent = pipe(x, H.sub(coord), H.abs);

      const deltaNext = pipe(currents, H.nthOrNone(H.inc(i), NaN), H.sub(coord), H.abs);

      const deltaPrev = pipe(currents, H.nthOrNone(H.dec(i), NaN), H.sub(coord), H.abs);

      const hasNextCond = !isNaN(deltaNext) && deltaCurrent < deltaNext;

      const hasPrevCond = !isNaN(deltaPrev) && deltaCurrent < deltaPrev;

      const singleCond = isNaN(deltaNext) && isNaN(deltaPrev);

      return (hasNextCond || hasPrevCond || singleCond ? coord : x);
    };

    onChange(A.mapWithIndex(setCurrent)(currents));
  };

  private clickListener: (e: MouseEvent) => void = ({x, y}) => {
    const {orientation} = this.props;

    switch (orientation) {
      case 'horizontal':
        pipe(x, H.sub(this.base.getBoundingClientRect().x), this.pxToNum, this.onClick);
        break;

      case 'vertical':
        pipe(y, H.sub(this.base.getBoundingClientRect().y), this.pxToNum, this.onClick);
        break;
    }
  };

  private setClickListener: (t: 'add' | 'remove') => (n: HTMLElement) => void = (type) => (node) => {
    switch (type) {
      case 'add':
        H.addEventListener('click', this.clickListener)(node);
        break;

      case 'remove':
        H.removeEventListener('click', this.clickListener)(node);
        break;
    }
  };

  private onDrag: (i: number) => (x: number) => void = (id) => (coord) => {
    const {onChange} = this.props;

    const {currents} = this.state;

    const setCurrent: (i: number, x: number) => number = (i, x) => i === id ? coord : x;

    onChange(A.mapWithIndex(setCurrent)(currents));
  };

  private getDragListener: (o: View.NodeMap) => (e: MouseEvent) => void = ({id, node}) => ({x, y}) => {
    const {orientation} = this.props;

    const {currents} = this.state;

    switch (orientation) {
      case 'horizontal':
        pipe(
          currents,
          H.nthOrNone(id, NaN),
          H.add(pipe(x, H.sub(node.getBoundingClientRect().x), H.sub(pipe(node, H.offsetWidth, H.half)), this.pxToNum)),
          this.onDrag(id)
        );
        break;

      case 'vertical':
        pipe(
          currents,
          H.nthOrNone(id, NaN),
          H.add(pipe(y, H.sub(node.getBoundingClientRect().y), H.sub(pipe(node, H.offsetHeight, H.half)), this.pxToNum)),
          this.onDrag(id)
        );
        break;
    }
  };

  private setDragListener: (t: 'add' | 'remove') => (o: View.NodeMap) => void = (type) => ({id, node}) => {
    const {startDragListener, stopDragListener} = this.listenersStore;

    if (pipe(startDragListener, A.lookup(id)) === O.none && pipe(stopDragListener, A.lookup(id)) === O.none) {
      const listener = this.getDragListener({id, node});

      this.listenersStore.startDragListener = [...this.listenersStore.startDragListener, () => H.addEventListener('mousemove', listener)(window)];
      this.listenersStore.stopDragListener = [...this.listenersStore.stopDragListener, () => H.removeEventListener('mousemove', listener)(window)];
    }

    switch (type) {
      case 'add':
        H.addEventListener('mousedown', this.listenersStore.startDragListener[id])(node);
        H.addEventListener('mouseup', this.listenersStore.stopDragListener[id])(window);
        break;

      case 'remove':
        H.removeEventListener('mousedown', this.listenersStore.startDragListener[id])(node);
        H.removeEventListener('mouseup', this.listenersStore.stopDragListener[id])(window);
        break;
    }
  };

  private initEventListeners: () => void = () => {
    A.map(this.setDragListener('add'))(this.handlersMap);

    this.setClickListener('add')(this.base);
  };

  private removeEventListeners: () => void = () => {
    A.map(this.setDragListener('remove'))(this.handlersMap);

    this.setClickListener('remove')(this.base);
  };

  private clearListenersStore: () => void = () => {
    this.listenersStore = {
      startDragListener: [],
      stopDragListener: []
    };
  };

  // clear inner html

  private clearContainer: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    container.innerHTML = '';

    H.removeClassList([
      'pure-slider-base',
      `${bemBlockClassName}`
    ])(container);
  };
}



