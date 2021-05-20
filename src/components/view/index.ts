import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../globals/helpers';

import V from './namespace';
import * as D from './defaults';
import './styles.css';
import './theme.css';

export default class implements V.Interface {
  public props: V.Props = D.props;

  public state: V.State = D.state;

  // methods

  public setProps(props: V.Props) {
    this.props = {...this.props, ...props};
  }

  public setState(state: V.State) {
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

  public updateState(action: V.Action) {
    switch (action.type) {
      case 'UPDATE_HANDLERS_POSITION': {
        this.updateHandlersPosition(action.currents);

        break;
      }

      case 'SET_ORIENTATION': {
        this.setOrientation(action.orientation)
      }
    }
  };

  // properties

  private connectsMap: V.NodeMap[] = [];

  private handlersMap: V.NodeMap[] = [];

  private tooltipsMap: V.NodeMap[] = [];

  private base: HTMLDivElement = H.node('div');

  private eventListenersStore: V.EventListenersStore = {
    startDragListener: [],
    stopDragListener: []
  };

  // helpers

  private range: () => number = () => pipe(this.props.max, H.sub(this.props.min));

  private percentOfRange: (x: number) => number = (x) => pipe(x, H.percent(this.range()));

  private pxToNum: (x: number) => number = (px) => {
    const {container} = this.props;

    const {orientation} = this.state;

    switch (orientation) {
      case 'horizontal': {
        return pipe(px, H.mult(this.range()), H.div(pipe(container, H.offsetWidth)), Math.round);
      }

      case 'vertical': {
        return pipe(px, H.mult(this.range()), H.div(pipe(container, H.offsetHeight)), Math.round);
      }
    }
  };

  private correctToMin: (x: number) => number = (x) => pipe(x, H.sub(this.props.min));

  private getClassList: (k: V.NodeKeys) => string[] = (key) => {
    const {bemBlockClassName} = this.props;

    const {orientation} = this.state;

    const baseClassList = [`pure-slider-base__${key}`, `pure-slider-base__${key}_orientation_${orientation}`];

    const themeClassList = [`${bemBlockClassName}__${key}`, `${bemBlockClassName}__${key}_orientation_${orientation}`];

    return ([...baseClassList, ...themeClassList]);
  };

  private getConnectDimensions: (i: number) => { size: number, pos: number } = (id) => {
    const {intervals} = this.props;

    const {currents} = this.state;

    const first = 0, last = pipe(intervals, A.size, H.dec);

    switch (id) {
      case first: {
        const size = pipe(currents, H.headOrNone(NaN), this.correctToMin, this.percentOfRange);

        return ({size, pos: 0});
      }

      case last: {
        const size = pipe(currents, H.lastOrNone(NaN), this.correctToMin, H.sub(this.range()), H.abs, this.percentOfRange);

        const pos = pipe(currents, H.lastOrNone(NaN), this.correctToMin, this.percentOfRange);

        return ({size, pos});
      }

      default: {
        const size = pipe(currents, H.subAdjacent(id), this.percentOfRange);

        const pos = pipe(currents, H.nthOrNone(H.dec(id), NaN), this.correctToMin, this.percentOfRange);

        return ({size, pos});
      }
    }
  };

  private getHandlerDimensions: (i: number) => { pos: number } = (id) => {
    const {currents} = this.state;

    const pos = pipe(currents, H.nthOrNone(id, NaN), this.correctToMin, this.percentOfRange);

    return ({pos});
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

    H.addClassList(['pure-slider-base', `${bemBlockClassName}`])(container);
  };

  private renderBase: () => void = () => {
    const {container} = this.props;

    const classList = this.getClassList('base');

    this.base = pipe(H.node('div'), H.addClassList(classList), H.appendTo(container));
  };

  private renderConnects: () => void = () => {
    const {intervals} = this.props;

    const classList = this.getClassList('connect');

    const hasIntervalReducer: (i: number, xs: number[], x: boolean) => number[] = (i, xs, x) => x ? [...xs, i] : xs;

    const intervalsIndexes = A.reduceWithIndex([] as number[], hasIntervalReducer)(intervals);

    const renderConnect: () => HTMLDivElement = () => pipe(H.node('div'), H.addClassList(classList), H.appendTo(this.base));

    const setConnectMap: (x: number) => V.NodeMap = (id) => ({id, node: renderConnect()});

    this.connectsMap = A.map(setConnectMap)(intervalsIndexes);
  };

  private renderHandlers: () => void = () => {
    const {currents} = this.state;

    const classList = this.getClassList('handler');

    const renderHandler: () => HTMLDivElement = () => pipe(H.node('div'), H.addClassList(classList), H.appendTo(this.base));

    const setHandlerMap: (i: number) => V.NodeMap = (id: number) => ({id, node: renderHandler()});

    this.handlersMap = A.mapWithIndex(setHandlerMap)(currents);
  };

  private renderTooltips: () => void = () => {
    const classList = this.getClassList('tooltip');

    const renderTooltip: <T extends HTMLElement>(p: T) => HTMLSpanElement = (parent) => pipe(H.node('span'), H.addClassList(classList), H.appendTo(parent));

    const setTooltipMap: (o: V.NodeMap) => V.NodeMap = ({id, node}) => ({id, node: renderTooltip(node)});

    this.tooltipsMap = A.map(setTooltipMap)(this.handlersMap);
  };

  // set orientation action

  private setOrientation: (x: V.State['orientation']) => void = (orientation) => {
    this.state = {...this.state, orientation};

    this.destroy();

    this.render();
  }

  // update handlers action logic

  private updateHandlersPosition: (xs: V.State['currents']) => void = (currents) => {
    this.state = {...this.state, currents};

    this.updateNodes();
  };

  private updateNodes: () => void = () => {
    A.map(this.updateConnect)(this.connectsMap);

    A.map(this.updateHandler)(this.handlersMap);

    A.map(this.updateTooltip)(this.tooltipsMap);
  };

  private updateConnect: (o: V.NodeMap) => void = ({id, node}) => {
    const {orientation} = this.state;

    const {pos, size} = this.getConnectDimensions(id);

    switch (orientation) {
      case 'horizontal': {
        H.setInlineStyle(`left: ${pos}%; max-width: ${size}%;`)(node);

        break;
      }

      case 'vertical': {
        H.setInlineStyle(`top: ${pos}%; max-height: ${size}%;`)(node);

        break;
      }
    }
  };

  private updateHandler: (o: V.NodeMap) => void = ({id, node}) => {
    const {orientation} = this.state;

    const {pos} = this.getHandlerDimensions(id);

    switch (orientation) {
      case 'horizontal': {
        const offset = pipe(node, H.offsetWidth, H.half);

        H.setInlineStyle(`left: calc(${pos}% - ${offset}px);`)(node);

        break;
      }

      case 'vertical': {
        const offset = pipe(node, H.offsetHeight, H.half);

        H.setInlineStyle(`top: calc(${pos}% - ${offset}px);`)(node);

        break;
      }
    }
  };

  private updateTooltip: (o: V.NodeMap) => void = ({id, node}) => {
    const {currents} = this.state;

    const text = pipe(currents, H.nthOrNone(id, NaN), H.toString);

    pipe(node, H.setInnerText(text));
  };

  // on click listener logic

  private onClick: (x: number) => void = (coord) => {
    const {onChange} = this.props;

    const {currents} = this.state;

    const setNearestCurrent: (i: number, x: number) => number = (i, x) => {
      const deltaCurrent = pipe(x, H.sub(coord), H.abs);

      const deltaNext = pipe(currents, H.nthOrNone(H.inc(i), NaN), H.sub(coord), H.abs);

      const deltaPrev = pipe(currents, H.nthOrNone(H.dec(i), NaN), H.sub(coord), H.abs);

      const hasNextCond = !isNaN(deltaNext) && coord > x && deltaCurrent < deltaNext;

      const hasNotNextButHasPrevCond = isNaN(deltaNext) && !isNaN(deltaPrev) && coord > x;

      const hasPrevCond = !isNaN(deltaPrev) && coord < x && deltaCurrent < deltaPrev;

      const hasNotPrevButHasNextCond = isNaN(deltaPrev) && !isNaN(deltaNext) && coord < x;

      const singleCond = isNaN(deltaNext) && isNaN(deltaPrev);

      return (hasNextCond || hasPrevCond || hasNotNextButHasPrevCond || hasNotPrevButHasNextCond || singleCond
        ? coord
        : x);
    };

    onChange(A.mapWithIndex(setNearestCurrent)(currents));
  };

  private clickListener: (e: MouseEvent) => void = ({x, y}) => {
    const {min} = this.props;

    const {orientation} = this.state;

    switch (orientation) {
      case 'horizontal': {
        pipe(x, H.sub(this.base.getBoundingClientRect().x), this.pxToNum, H.add(min), this.onClick);

        break;
      }

      case 'vertical': {
        pipe(y, H.sub(this.base.getBoundingClientRect().y), this.pxToNum, H.add(min), this.onClick);

        break;
      }
    }
  };

  private setClickListener: (t: 'add' | 'remove') => (n: HTMLElement) => void = (type) => (node) => {
    switch (type) {
      case 'add': {
        H.addEventListener('click', this.clickListener)(node);

        break;
      }

      case 'remove': {
        H.removeEventListener('click', this.clickListener)(node);

        break;
      }
    }
  };

  // on drag listener logic

  private onDrag: (i: number) => (x: number) => void = (id) => (coord) => {
    const {onChange} = this.props;

    const {currents} = this.state;

    const setCorrespondingCurrent: (i: number, x: number) => number = (i, x) => i === id ? coord : x;

    onChange(A.mapWithIndex(setCorrespondingCurrent)(currents));
  };

  private getDragListener: (o: V.NodeMap) => (e: MouseEvent) => void = ({id, node}) => ({x, y}) => {
    const {currents, orientation} = this.state;

    switch (orientation) {
      case 'horizontal': {
        const offset = pipe(node, H.offsetWidth, H.half);

        const delta = pipe(x, H.sub(node.getBoundingClientRect().x), H.sub(offset), this.pxToNum);

        pipe(currents, H.nthOrNone(id, NaN), H.add(delta), this.onDrag(id));

        break;
      }

      case 'vertical': {
        const offset = pipe(node, H.offsetHeight, H.half);

        const delta = pipe(y, H.sub(node.getBoundingClientRect().y), H.sub(offset), this.pxToNum);

        pipe(currents, H.nthOrNone(id, NaN), H.add(delta), this.onDrag(id));

        break;
      }
    }
  };

  private setDragListener: (t: 'add' | 'remove') => (o: V.NodeMap) => void = (type) => ({id, node}) => {
    const {startDragListener, stopDragListener} = this.eventListenersStore;

    const hasStartDragListener = pipe(startDragListener, A.lookup(id)) !== O.none;

    const hasStopDragListener = pipe(stopDragListener, A.lookup(id)) !== O.none;

    if (!(hasStartDragListener || hasStopDragListener)) {
      const listener = this.getDragListener({id, node});

      this.eventListenersStore.startDragListener = [...this.eventListenersStore.startDragListener,
        () => H.addEventListener('mousemove', listener)(window)];

      this.eventListenersStore.stopDragListener = [...this.eventListenersStore.stopDragListener,
        () => H.removeEventListener('mousemove', listener)(window)];
    }

    switch (type) {
      case 'add': {
        H.addEventListener('mousedown', this.eventListenersStore.startDragListener[id])(node);

        H.addEventListener('mouseup', this.eventListenersStore.stopDragListener[id])(window);

        break;
      }

      case 'remove': {
        H.removeEventListener('mousedown', this.eventListenersStore.startDragListener[id])(node);

        H.removeEventListener('mouseup', this.eventListenersStore.stopDragListener[id])(window);

        break;
      }
    }
  };

  // set listeners logic

  private initEventListeners: () => void = () => {
    A.map(this.setDragListener('add'))(this.handlersMap);

    this.setClickListener('add')(this.base);
  };

  private removeEventListeners: () => void = () => {
    A.map(this.setDragListener('remove'))(this.handlersMap);

    this.setClickListener('remove')(this.base);
  };

  private clearListenersStore: () => void = () => {
    this.eventListenersStore = {startDragListener: [], stopDragListener: []};
  };

  // clear inner html

  private clearContainer: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    container.innerHTML = '';

    H.removeClassList(['pure-slider-base', `${bemBlockClassName}`])(container);
  };
}



