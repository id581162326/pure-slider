import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {constant, pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import Connect from './connect';
import Handler from './handler';
import Tooltip from './tooltip';
import Base from './base';
import Container from './container';
import Namespace from './namespace';
import './styles.css';
import './theme.css';

class View implements Namespace.Interface {
  static readonly of: Namespace.Of = (props, state) => new View(props, state);

  public readonly destroy: Namespace.Destroy = () => {};

  public readonly update: Namespace.Update = (action) => {
    switch (action.type) {
      case 'MOVE_HANDLERS': {
        this.state = {...this.state, currents: action.currents};

        this.moveHandlersTo(action.currents);

        break;
      }
    }
  };

  private constructor(private readonly props: Namespace.Props, private state: Namespace.State) {
    this.container = this.renderContainer();

    this.base = this.renderBase();

    this.handlers = this.renderHandlers();

    this.connects = this.renderConnects();

    const tooltipsEnabled = pipe(props, H.prop('tooltipOptions'), H.prop('enabled'));

    this.tooltips = tooltipsEnabled ? this.renderTooltips() : [];
  }

  private readonly container: Namespace.Container;

  private readonly base: Namespace.Base;

  private readonly connects: Namespace.Connect[];

  private readonly handlers: Namespace.Handler[];

  private readonly tooltips: Namespace.Tooltip[];

  private readonly getBemBlockClassName: Namespace.GetBemBlockClassName = () => ({
    base: 'pure-slider',
    theme: pipe(this.props, H.prop('themeBemBlockClassName'), O.fromNullable, O.getOrElse(constant('-slider')))
  });

  private readonly appendElementTo: Namespace.AppendElementTo = (parent) => (element) => {
    const node = pipe(element, H.prop('getNode'))();

    const parentNode = pipe(parent, H.prop('getNode'))();

    pipe(node, H.appendTo(parentNode));

    return (element);
  };

  private readonly moveElementTo: Namespace.MoveElementTo = (currents) => (element) => {
    pipe(element, H.prop('moveTo'))(currents);

    return (element);
  };

  private readonly renderContainer: Namespace.RenderContainer = () => {
    const {orientation, range, container} = this.props;

    const containerProps: Namespace.ContainerProps = {bemBlockClassName: this.getBemBlockClassName(), orientation, range, container};

    const ofContainer = pipe(Container, H.prop('of'));

    return (pipe(containerProps, ofContainer));
  };

  private readonly renderBase: Namespace.RenderBase = () => {
    const {orientation, range, container} = this.props;

    const baseProps: Namespace.BaseProps = {bemBlockClassName: this.getBemBlockClassName(), orientation, range, container, onClick: H.trace};

    const ofBase = pipe(Base, H.prop('of'));

    return (pipe(baseProps, ofBase, this.appendElementTo(this.container)));
  };

  private readonly renderConnects: Namespace.RenderConnects = () => {
    const {intervals, orientation, range, container} = this.props;

    const {currents} = this.state;

    const hasIntervalReducer = (i: number, xs: number[], x: boolean): number[] => x ? [...xs, i] : xs;

    const intervalsIndexes = A.reduceWithIndex([] as number[], hasIntervalReducer)(intervals);

    const getConnectProps = (idx: number): Namespace.ConnectProps => ({
      container,
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      type: A.size(intervals) === 3
        ? idx === 0 ? 'from-start' : idx === 2 ? 'to-end' : 'inner'
        : idx === 0 ? 'from-start' : 'to-end'
    });

    const ofConnect = pipe(Connect, H.prop('of'));

    const initConnect = (idx: number): Namespace.Connect => pipe(
      idx,
      getConnectProps,
      ofConnect,
      this.appendElementTo(this.base),
      this.moveElementTo(currents)
    );

    return (A.map(initConnect)(intervalsIndexes));
  };

  private readonly renderHandlers: Namespace.RenderHandlers = () => {
    const {orientation, range, container, onChange} = this.props;

    const {currents} = this.state;

    const getHandlerProps = (idx: number): Namespace.HandlerProps => ({
      container,
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      type: A.size(currents) === 2 ? H.trace(idx) === 0 ? 'start' : 'end' : 'single',
      onDrag: (type) => (coord) => pipe(type === 'start'
        ? [pipe(this.state, H.prop('currents'), NEA.head, H.add(coord)), pipe(this.state, H.prop('currents'), NEA.last)]
        : type === 'single'
          ? [pipe(this.state, H.prop('currents'), NEA.head, H.add(coord))]
          : [pipe(this.state, H.prop('currents'), NEA.head), pipe(this.state, H.prop('currents'), NEA.last, H.add(coord))],
        onChange
      )
    });

    const ofHandler = pipe(Handler, H.prop('of'));

    const initHandler = (idx: number): Namespace.Handler => pipe(
      idx,
      getHandlerProps,
      ofHandler,
      this.appendElementTo(this.base),
      this.moveElementTo(currents)
    );

    return (A.mapWithIndex(initHandler)(currents));
  };

  private readonly renderTooltips: Namespace.RenderTooltips = () => {
    const {container, orientation, range, tooltipOptions} = this.props;

    const {currents} = this.state;

    const ofTooltip = pipe(Tooltip, H.prop('of'));

    const getTooltipProps = (idx: number): Namespace.TooltipProps => ({
      container,
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      alwaysShown: pipe(tooltipOptions, H.prop('alwaysShown')),
      type: A.size(currents) === 2 ? idx === 0 ? 'start' : 'end' : 'single'
    });

    const initTooltip = (idx: number, handler: Namespace.Handler): Namespace.Tooltip => pipe(
      idx,
      getTooltipProps,
      ofTooltip,
      this.appendElementTo(handler),
      this.moveElementTo(currents)
    );

    return (A.mapWithIndex(initTooltip)(this.handlers));
  };

  private readonly moveHandlersTo: Namespace.MoveAllElementsTo = (currents) => {
    pipe(this.connects, A.map(this.moveElementTo(currents)));

    pipe(this.handlers, A.map(this.moveElementTo(currents)));

    pipe(this.tooltips, A.map(this.moveElementTo(currents)));
  };
}

export default View;



