import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {constant, flow, pipe} from 'fp-ts/function';

import * as H from '../../helpers';

import Connect from './connect';
import Handler from './handler';
import Base from './base';
import Scale from './scale';
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

      case 'TOGGLE_TOOLTIPS': {
        this.toggleTooltipElements();

        break;
      }

      case 'TOGGLE_ORIENTATION': {
        this.toggleBaseAndContainerOrientation();

        this.toggleConnectsOrientation();

        this.toggleHandlersOrientation();

        this.toggleScaleOrientation();

        break;
      }

      case 'TOGGLE_SCALE': {
        this.toggleScaleElement();

        break;
      }
    }
  };

  private constructor(private readonly props: Namespace.Props, private state: Namespace.State) {
    this.container = this.renderContainer();

    this.base = this.renderBase();

    this.handlers = this.renderHandlers();

    this.connects = this.renderConnects();

    this.scale = props.scaleOptions.enabled ? this.renderScale() : null;
  }

  private readonly container: Namespace.Container;

  private readonly base: Namespace.Base;

  private readonly connects: Namespace.Connect[];

  private readonly handlers: Namespace.Handler[];

  private readonly scale: Namespace.Scale | null;

  private readonly getBemBlockClassName: Namespace.GetBemBlockClassName = () => ({
    base: 'pure-slider',
    theme: pipe(this.props, H.prop('themeBemBlockClassName'), O.fromNullable, O.getOrElse(constant('-slider')))
  });

  private readonly appendElementTo: Namespace.AppendElementTo = (parent) => (element) => {
    const node = element.getNode();

    const parentNode = parent.getNode();

    pipe(node, H.appendTo(parentNode));

    return (element);
  };

  private readonly toggleElementOrientation: Namespace.ToggleElementOrientation = (element) => {
    element.toggleOrientation();

    return (element);
  };

  private readonly moveElementTo: Namespace.MoveElementTo = (currents) => (element) => {
    element.moveTo(currents);

    return (element);
  };

  private readonly renderContainer: Namespace.RenderContainer = () => {
    const {range, container} = this.props;

    const {orientation} = this.state;

    const containerProps: Namespace.ContainerProps = {bemBlockClassName: this.getBemBlockClassName(), orientation, range, container};

    const ofContainer = pipe(Container, H.prop('of'));

    return (pipe(containerProps, ofContainer));
  };

  private readonly renderBase: Namespace.RenderBase = () => {
    const {range, container} = this.props;

    const {orientation} = this.state;

    const baseProps: Namespace.BaseProps = {bemBlockClassName: this.getBemBlockClassName(), orientation, range, container, onClick: H.trace};

    const ofBase = pipe(Base, H.prop('of'));

    return (pipe(baseProps, ofBase, this.appendElementTo(this.container)));
  };

  private readonly renderConnects: Namespace.RenderConnects = () => {
    const {connectType, range, container} = this.props;

    const {orientation, currents} = this.state;

    const connectMap = connectType === 'outer-range'
      ? [0, 2] : connectType === 'inner-range'
        ? [1] : connectType === 'from-start'
          ? [0] : connectType === 'to-end'
            ? [1] : [];

    const getConnectProps = (idx: number): Namespace.ConnectProps => ({
      container,
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      type: connectType === 'outer-range' || connectType === 'inner-range'
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

    return (A.map(initConnect)(connectMap));
  };

  private readonly renderHandlers: Namespace.RenderHandlers = () => {
    const {range, container, handlerOptions, onChange, step} = this.props;

    const {tooltipAlwaysShown, showTooltip} = handlerOptions;

    const {currents, orientation} = this.state;

    const getHandlerProps = (idx: number): Namespace.HandlerProps => ({
      container,
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      showTooltip,
      step,
      tooltipAlwaysShown,
      type: A.size(currents) === 2 ? idx === 0 ? 'start' : 'end' : 'single',
      onChange: (type) => (coord) => pipe(type === 'start'
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

  private readonly renderScale: Namespace.RenderScale = () => {
    const {container, range, scaleOptions, connectType, step} = this.props;

    const {currents, orientation} = this.state;

    const ofScale = pipe(Scale, H.prop('of'));

    const scaleProps: Namespace.ScaleProps = {
      container,
      orientation,
      range,
      connectType,
      step,
      showUnitEach: scaleOptions.showUnitEach,
      withValue: scaleOptions.withValue,
      showValueEach: scaleOptions.showValueEach,
      bemBlockClassName: this.getBemBlockClassName(),
      onClick: () => {}
    };

    return (pipe(scaleProps, ofScale, this.moveElementTo(currents), this.appendElementTo(this.base)));
  };

  private readonly moveHandlersTo: Namespace.MoveHandlersTo = (currents) => {
    pipe(this.connects, A.map(this.moveElementTo(currents)));

    pipe(this.handlers, A.map(this.moveElementTo(currents)));

    if (this.scale) {
      pipe(this.scale, this.moveElementTo(currents));
    }
  };

  private readonly toggleBaseAndContainerOrientation: Namespace.ToggleBaseAndContainerOrientation = () => {
    this.toggleElementOrientation(this.base);

    this.toggleElementOrientation(this.container);
  }

  private readonly toggleScaleOrientation: Namespace.ToggleScaleOrientation = () => {
    const {currents} = this.state;

    if (this.scale) {
      const units = this.scale.getUnits();

      const toggleUnitOrientationAndUpdatePosition = (x: Namespace.Unit) => pipe(x, this.toggleElementOrientation, H.prop('updatePosition'))()

      A.map(toggleUnitOrientationAndUpdatePosition)(units);

      pipe(this.scale, this.toggleElementOrientation, this.moveElementTo(currents));
    }
  }

  private readonly toggleHandlersOrientation: Namespace.ToggleHandlersOrientation = () => {
    const {currents} = this.state;

    const handler = (x: Namespace.Handler): Namespace.Handler => x;

    A.map(flow(handler, this.toggleElementOrientation, this.moveElementTo(currents)))(this.handlers);

    const tooltip = (x: Namespace.Handler): Namespace.Tooltip | null => x.getTooltip();

    A.map(flow(tooltip, O.fromNullable, O.map((x) => O.some(x) ? x.toggleOrientation() : false)))(this.handlers);
  }

  private readonly toggleConnectsOrientation: Namespace.ToggleConnectsOrientation = () => {
    const {currents} = this.state;

    const connect = (x: Namespace.Connect): Namespace.Connect => x;

    A.map(flow(connect, this.toggleElementOrientation, this.moveElementTo(currents)))(this.connects);
  }

  private readonly toggleScaleElement: Namespace.ToggleScaleElement = () => {
    if (this.scale) {
      this.scale.getNode().parentNode ? this.scale.destroy() : this.appendElementTo(this.base)(this.scale)
    }
  }

  private readonly toggleTooltipElements: Namespace.ToggleTooltipElements = () => {
    const handler = (x: Namespace.Handler): Namespace.Handler => x;

    const toggleTooltip = (x: Namespace.Handler): void => x.toggleTooltip();

    A.map(flow(handler, toggleTooltip))(this.handlers)
  }
}

export default View;



