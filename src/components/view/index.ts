import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import V from './namespace';
import * as D from './defaults';
import './styles.css';
import './theme.css';

export default class implements V.Interface {
  public props: V.Props = D.props;

  // methods

  public setProps(props: V.Props) {
    this.props = {...this.props, ...props};
  }

  public render() {
    this.renderContainer();

    this.renderNodes();

    this.updateNodes();

    this.addEventListeners();
  };

  public destroy() {
    this.removeEventListeners();

    this.clearListenersStore();

    this.clearNodeMaps();

    this.clearContainer();
  };

  public updateProps(action: V.Action) {
    switch (action.type) {
      case 'SET_HANDLERS': {
        this.updateHandlers(action.currents);

        break;
      }

      case 'SET_ORIENTATION': {
        this.setOrientation(action.orientation);
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

  private getRange: () => number = () => pipe(this.props.range, H.subAdjacent(1));

  private percentOfRange: (x: number) => number = (x) => {
    const range = this.getRange();

    return (pipe(x, H.percent(range)))
  };

  private nodeSize: <T extends HTMLElement>(n: T) => number = (node) => {
    const {orientation} = this.props;

    return (orientation === 'horizontal' ? H.offsetWidth(node) : H.offsetHeight(node));
  }

  private pxToNum: (x: number) => number = (px) => {
    const {container} = this.props;

    const containerSize = pipe(container, this.nodeSize);

    const range = this.getRange();

    return pipe(px, H.mult(range), H.div(containerSize), Math.round);
  };

  private correctToMin: (x: number) => number = (x) => pipe(x, H.sub(pipe(this.props.range, NEA.head)));

  private getClassList: (k: V.NodeKeys) => string[] = (key) => {
    const {orientation, bemBlockClassName, tooltipOptions} = this.props;

    const baseBemBlockClassName = 'pure-slider';

    const baseClassList = [`${baseBemBlockClassName}__${key}`, `${baseBemBlockClassName}__${key}_orientation_${orientation}`,
      ...(key === 'tooltip' && tooltipOptions.alwaysShown ? [`${baseBemBlockClassName}__${key}_shown`] : [])];

    const themeClassList = [`${bemBlockClassName}__${key}`, `${bemBlockClassName}__${key}_orientation_${orientation}`];

    return ([...baseClassList, ...themeClassList]);
  };

  private getConnectDimensions: (i: number) => { size: number, pos: number } = (id) => {
    const {currents, intervals} = this.props;

    const first = 0, last = pipe(intervals, A.size, H.dec);

    const range = this.getRange();

    switch (id) {
      case first: {
        const size = pipe(currents, H.headOrNone(NaN), this.correctToMin, this.percentOfRange);

        return ({size, pos: 0});
      }

      case last: {
        const size = pipe(currents, H.lastOrNone(NaN), this.correctToMin, H.sub(range), H.abs, this.percentOfRange);

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
    const {currents} = this.props;

    const pos = pipe(currents, H.nthOrNone(id, NaN), this.correctToMin, this.percentOfRange);

    return ({pos});
  };

  // render logic

  private renderNodes: () => void = () => {
    const {tooltipOptions} = this.props;

    this.renderBase();

    this.renderConnects();

    this.renderHandlers();

    if (tooltipOptions.enabled) {
      this.renderTooltips();
    }
  };

  private renderContainer: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    H.addClassList(['pure-slider', `${bemBlockClassName}`])(container);
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
    const {currents} = this.props;

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

  private setOrientation: (x: V.Orientation) => void = (orientation) => {
    this.props = {...this.props, orientation};

    this.reRender();
  };

  // update handlers action logic

  private updateHandlers: (xs: V.Currents) => void = (currents) => {
    this.props = {...this.props, currents};

    this.updateNodes();
  };

  private updateNodes: () => void = () => {
    const {tooltipOptions} = this.props;

    A.map(this.updateConnect)(this.connectsMap);

    A.map(this.updateHandler)(this.handlersMap);

    if (tooltipOptions.enabled) {
      A.map(this.updateTooltip)(this.tooltipsMap);
    }
  };

  private updateConnect: (o: V.NodeMap) => void = ({id, node}) => {
    const {orientation} = this.props;

    const {pos, size} = this.getConnectDimensions(id);

    const style = orientation === 'horizontal'
      ? `left: ${pos}%; max-width: ${size}%;`
      : `top: ${pos}%; max-height: ${size}%;`;

    H.setInlineStyle(style)(node);
  };

  private updateHandler: (o: V.NodeMap) => void = ({id, node}) => {
    const {orientation} = this.props;

    const {pos} = this.getHandlerDimensions(id);

    const offset = pipe(node, this.nodeSize, H.half);

    const style = orientation === 'horizontal'
      ? `left: calc(${pos}% - ${offset}px);`
      : `top: calc(${pos}% - ${offset}px);`;

    H.setInlineStyle(style)(node);
  };

  private updateTooltip: (o: V.NodeMap) => void = ({id, node}) => {
    const {currents} = this.props;

    const text = pipe(currents, H.nthOrNone(id, NaN), H.toString);

    pipe(node, H.setInnerText(text));
  };

  // on click listener logic

  private onClick: (x: number) => void = (coord) => {
    const {onChange, currents} = this.props;

    const setNearestCurrent: (i: number, x: number) => number = (i, x) => {
      const deltaCurrent = pipe(x, H.sub(coord), H.abs);

      const deltaNext = pipe(currents, H.nthOrNone(H.inc(i), NaN), H.sub(coord), H.abs);

      const deltaPrev = pipe(currents, H.nthOrNone(H.dec(i), NaN), H.sub(coord), H.abs);

      const hasNextCond = !isNaN(deltaNext) && coord > x && deltaCurrent <= deltaNext;

      const hasNotNextButHasPrevCond = isNaN(deltaNext) && !isNaN(deltaPrev) && coord > x;

      const hasPrevCond = !isNaN(deltaPrev) && coord < x && deltaCurrent < deltaPrev;

      const hasNotPrevButHasNextCond = isNaN(deltaPrev) && !isNaN(deltaNext) && coord < x;

      const singleCond = isNaN(deltaNext) && isNaN(deltaPrev);

      const isClosest = hasNextCond || hasPrevCond || hasNotNextButHasPrevCond || hasNotPrevButHasNextCond || singleCond;

      return (isClosest ? coord : x);
    };

    onChange(A.mapWithIndex(setNearestCurrent)(currents) as V.Currents);
  };

  private clickListener: (e: MouseEvent) => void = (event) => {
    const {range, orientation} = this.props;

    const min = pipe(range, NEA.head);

    const coordKey = orientation === 'horizontal' ? 'x' : 'y';

    pipe(event[coordKey], H.sub(this.base.getBoundingClientRect()[coordKey]), this.pxToNum, H.add(min), this.onClick);
  };

  private setClickListener: (t: 'add' | 'remove') => (n: HTMLElement) => void = (type) => (node) => {
    type === 'add'
      ? H.addEventListener('click', this.clickListener)(node)
      : H.removeEventListener('click', this.clickListener)(node);
  };

  // on drag listener logic

  private onDrag: (i: number) => (x: number) => void = (id) => (coord) => {
    const {currents, onChange} = this.props;

    const setCorrespondingCurrent: (i: number, x: number) => number = (i, x) => i === id ? coord : x;

    onChange(A.mapWithIndex(setCorrespondingCurrent)(currents) as V.Currents);
  };

  private getDragListener: (o: V.NodeMap) => (e: MouseEvent) => void = ({id, node}) => (event) => {
    const {currents, orientation} = this.props;

    const coordKey = orientation === 'horizontal' ? 'x' : 'y';

    const offset = pipe(node, this.nodeSize, H.half);

    const delta = pipe(event[coordKey], H.sub(node.getBoundingClientRect()[coordKey]), H.sub(offset), this.pxToNum);

    pipe(currents, H.nthOrNone(id, NaN), H.add(delta), this.onDrag(id));
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

    type === 'add'
      ? H.addEventListener('mousedown', this.eventListenersStore.startDragListener[id])(node)
      : H.removeEventListener('mousedown', this.eventListenersStore.startDragListener[id])(node);

    type === 'add'
      ? H.addEventListener('mouseup', this.eventListenersStore.stopDragListener[id])(window)
      : H.removeEventListener('mouseup', this.eventListenersStore.stopDragListener[id])(window);
  };

  // set listeners logic

  private addEventListeners: () => void = () => {
    A.map(this.setDragListener('add'))(this.handlersMap);

    this.setClickListener('add')(this.base);
  };

  private removeEventListeners: () => void = () => {
    A.map(this.setDragListener('remove'))(this.handlersMap);

    this.setClickListener('remove')(this.base);
  };

  // clear logic

  private clearContainer: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    container.innerHTML = '';

    H.removeClassList(['pure-slider', `${bemBlockClassName}`])(container);
  };

  private clearListenersStore: () => void = () => {
    this.eventListenersStore = {startDragListener: [], stopDragListener: []};
  };

  private clearNodeMaps: () => void = () => {
    this.handlersMap = [];

    this.connectsMap = [];
  };

  // re-render

  private reRender: () => void = () => {
    this.destroy();

    this.render();
  };
}



