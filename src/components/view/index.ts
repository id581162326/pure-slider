import * as A from 'fp-ts/Array';
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

  private range: () => number = () => H.sub(this.props.min)(this.props.max);

  private percentOfRange: (x: number) => number = (x) => pipe(x, H.percent(this.range()));

  private pxToNum: (x: number) => number = (px) => {
    const {orientation, container} = this.props;

    switch (orientation) {
      case 'horizontal':
        return pipe(px, H.round, H.mult(this.range()), H.div(pipe(container, H.offsetWidth)), H.round);
      case 'vertical':
        return pipe(px, H.round, H.mult(this.range()), H.div(pipe(container, H.offsetHeight)), H.round);
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

    switch (id) {
      case 0:
        return ({
          size: pipe(currents, H.headOrNone(0), this.correctToMin, this.percentOfRange),
          pos: 0
        });
      case pipe(intervals, A.size, H.dec):
        return ({
          size: pipe(this.range(), H.sub(pipe(currents, H.lastOrNone(0), this.correctToMin)), this.percentOfRange),
          pos: pipe(currents, H.lastOrNone(0), this.correctToMin, this.percentOfRange)
        });
      default:
        return ({
          size: pipe(
            pipe(pipe(currents, H.nthOrNone(id, 0), this.correctToMin), H.sub(pipe(currents, H.nthOrNone(H.dec(id), 0), this.correctToMin))),
            this.percentOfRange
          ),
          pos: pipe(currents, H.nthOrNone(H.dec(id), 0), this.correctToMin, this.percentOfRange)
        });
    }
  };

  private getHandlerDimensions: (i: number) => { pos: number } = (id) => {
    const {currents} = this.state;

    return ({pos: pipe(currents, H.nthOrNone(id, 0), this.correctToMin, this.percentOfRange)});
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

    this.connectsMap = A.map((id: number) => ({
      id,
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      )
    }))(intervalsIndexes);
  };

  private renderHandlers: () => void = () => {
    const {currents} = this.state;

    const classList = this.getClassList('handler');

    this.handlersMap = A.mapWithIndex((id) => ({
      id,
      node: pipe(
        H.node('div'),
        H.addClassList(classList),
        H.appendTo(this.base)
      )
    }))(currents);
  };

  private renderTooltips: () => void = () => {
    const classList = this.getClassList('tooltip');

    this.tooltipsMap = A.map(({id, node}: View.NodeMap) => ({
      id,
      node: pipe(H.node('span'), H.addClassList(classList), H.appendTo(node))
    }))(this.handlersMap);
  };

  // update logic

  private updateHandlersPosition: (xs: View.State['currents']) => void = (_currents) => {
    const {currents} = this.state;

    this.state = {...this.state, currents: _currents};

    if (H.length(currents) !== (H.length(_currents))) {
      this.destroy();
      this.render();
    }

    this.updateNodes();
  }

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

    pipe(node, H.setInnerText(pipe(currents, H.nthOrNone(id, 0), H.toString)));
  };

  // event listeners logic

  private listenersStore: View.ListenersStore = {
    startDragListener: [],
    stopDragListener: []
  };

  private onDragHandler: (i: number) => (x: number) => void = (id) => (coord) => {
    const {onDragHandler} = this.props;

    const {currents} = this.state;

    const setCurrent: (i: number, x: number) => number = (i, x) => i === id ? coord : x;

    onDragHandler(A.mapWithIndex(setCurrent)(currents));
  };

  private getDragListener: (o: View.NodeMap) => (e: MouseEvent) => void = ({id, node}) => ({x, y}) => {
    const {orientation} = this.props;
    const {currents} = this.state;

    switch (orientation) {
      case 'horizontal':
        pipe(
          currents,
          H.nthOrNone(id, 0),
          H.add(pipe(x, H.sub(node.getBoundingClientRect().x), H.sub(pipe(node, H.offsetWidth, H.half)), this.pxToNum)),
          this.onDragHandler(id)
        );
        break;
      case 'vertical':
        pipe(
          currents,
          H.nthOrNone(id, 0),
          H.add(pipe(y, H.sub(node.getBoundingClientRect().y), H.sub(pipe(node, H.offsetHeight, H.half)), this.pxToNum)),
          this.onDragHandler(id)
        );
        break;
    }
  };

  private setDragListener: (t: 'add' | 'remove') => (o: View.NodeMap) => void = (type) => ({id, node}) => {
    const listener = this.getDragListener({id, node});

    this.listenersStore.startDragListener = [...this.listenersStore.startDragListener, () => H.addEventListener('mousemove', listener)(window)];
    this.listenersStore.stopDragListener = [...this.listenersStore.stopDragListener, () => H.removeEventListener('mousemove', listener)(window)];

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
  };

  private removeEventListeners: () => void = () => {
    A.map(this.setDragListener('remove'))(this.handlersMap);
  };

  private clearListenersStore: () => void = () => {
    this.listenersStore = {
      startDragListener: [],
      stopDragListener: []
    };
  };

  //

  private clearContainer: () => void = () => {
    const {container, bemBlockClassName} = this.props;

    container.innerHTML = '';

    H.removeClassList([
      'pure-slider-base',
      `${bemBlockClassName}`
    ])(container);
  };
}



