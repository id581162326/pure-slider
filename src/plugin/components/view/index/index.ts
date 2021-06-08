import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {constant, pipe} from 'fp-ts/function';

import * as H from '../../../../helpers';

import Connect from '../components/connect';
import Handler from '../components/handler';
import Base from '../components/base';
import Scale from '../components/scale';
import Container from '../components/container';
import Namespace from './namespace';
import './styles.css';
import './theme.css';

class View implements Namespace.Interface {
  static readonly of: Namespace.Of = (props, state) => new View(props, state);

  public readonly update: Namespace.Update = (action) => {
    switch (action.type) {
      case 'UPDATE_CURRENTS': {
        const oldCurrents = this.state.currents;

        this.state = {...this.state, currents: action.currents};

        A.size(oldCurrents) !== A.size(action.currents) ? this.reRender() : this.moveHandlersTo(action.currents);

        break;
      }

      case 'UPDATE_RANGE': {
        if (this.state.range !== action.range) {
          this.state = {...this.state, range: action.range};

          this.reRender();
        }

        break;
      }

      case 'UPDATE_STEP': {
        if (this.state.step !== action.step) {
          this.state = {...this.state, step: action.step};

          this.reRender();
        }

        break;
      }

      case 'SET_CONNECT_TYPE': {
        if (this.state.connectType !== action.connectType) {
          this.state = {...this.state, connectType: action.connectType};

          this.reRender();
        }

        break;
      }

      case 'TOGGLE_TOOLTIPS': {
        this.state = {...this.state, showTooltips: !this.state.showTooltips};

        this.reRender();

        break;
      }

      case 'TOGGLE_ORIENTATION': {
        this.state = {
          ...this.state,
          orientation: this.state.orientation === 'horizontal' ? 'vertical' : 'horizontal'
        };

        this.reRender();

        break;
      }

      case 'TOGGLE_SCALE': {
        this.state = {...this.state, showScale: !this.state.showScale};

        this.reRender();

        break;
      }
    }
  };

  private constructor(private readonly props: Namespace.Props, private state: Namespace.State) {
    this.container = this.renderContainer();
    this.base = this.renderBase();
    this.handlers = this.renderHandlers();
    this.connects = this.renderConnects();
    this.scale = this.renderScale();

    if (!state.showScale) {
      this.destroyElement(this.scale);
    }
  }

  private container: Namespace.ContainerInterface;
  private base: Namespace.BaseInterface;
  private connects: Namespace.ConnectInterface[];
  private handlers: [Namespace.HandlerInterface, Namespace.HandlerInterface] | [Namespace.HandlerInterface];
  private scale: Namespace.ScaleInterface;

  private readonly getBemBlockClassName: Namespace.GetBemBlockClassName = () => ({
    base: 'pure-slider',
    theme: pipe(this.props, H.prop('themeBemBlockClassName'), O.fromNullable, O.getOrElse(constant('-slider')))
  });

  private readonly moveElementTo: Namespace.MoveElementTo = (currents) => (element) => {
    element.moveTo(currents);

    return (element);
  };

  private readonly destroyElement: Namespace.DestroyElement = (element) => {
    element.destroy();

    return (element);
  };

  private readonly destroy: Namespace.Destroy = () => {
    A.map(this.destroyElement)(this.handlers);
    A.map(this.destroyElement)(this.connects);

    this.destroyElement(this.scale);
    this.destroyElement(this.base);
    this.destroyElement(this.container);
  }

  private readonly render: Namespace.Render = () => {
    this.container = this.renderContainer();
    this.base = this.renderBase();
    this.scale = this.renderScale();
    this.handlers = this.renderHandlers();
    this.connects = this.renderConnects();

    if (!this.state.showScale) {
      this.destroyElement(this.scale);
    }
  };

  private readonly reRender: Namespace.ReRender = () => {
    this.destroy();
    this.render();
  }

  private readonly renderContainer: Namespace.RenderContainer = () => {
    const {container} = this.props;

    const {orientation, range} = this.state;

    const containerProps: Namespace.ContainerProps = {bemBlockClassName: this.getBemBlockClassName(), orientation, range, container};

    const ofContainer = Container.of;

    return (pipe(containerProps, ofContainer));
  };

  private readonly renderBase: Namespace.RenderBase = () => {
    const {container} = this.props;

    const {orientation, range} = this.state;

    const baseProps: Namespace.BaseProps = {
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      container,
      onClick: this.handleClick
    };

    const ofBase = Base.of;

    const base = pipe(baseProps, ofBase);

    H.appendTo(container)(base.getNode());

    return (base);
  };

  private readonly renderConnects: Namespace.RenderConnects = () => {
    const {container} = this.props;

    const {connectType, range, orientation, currents} = this.state;

    const connectMap = connectType === 'outer-range'
      ? [0, 2] : connectType === 'inner-range' && A.size(currents) === 2
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

    const ofConnect = Connect.of;

    const initConnect = (idx: number): Namespace.ConnectInterface => pipe(idx, getConnectProps, ofConnect);

    const connects = A.map(initConnect)(connectMap);

    pipe(connects, A.map((x) => x.getNode()), H.appendChildListTo(this.base.getNode()));

    pipe(connects, A.map(this.moveElementTo(currents)));

    return (connects);
  };

  private readonly renderHandlers: Namespace.RenderHandlers = () => {
    const {container, tooltipOptions} = this.props;

    const {showTooltips} = this.state;

    const {range, currents, orientation, step} = this.state;

    const getHandlerProps = (idx: number): Namespace.HandlerProps => ({
      container,
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      showTooltip: showTooltips,
      step,
      tooltipAlwaysShown: tooltipOptions ? tooltipOptions.alwaysShown : false,
      type: A.size(currents) === 2 ? idx === 0 ? 'start' : 'end' : 'single',
      onDrag: this.handleDrag
    });

    const ofHandler = Handler.of;

    const initHandler = (idx: number): Namespace.HandlerInterface => pipe(idx, getHandlerProps, ofHandler);

    const handlers = A.mapWithIndex(initHandler)(currents) as [Namespace.HandlerInterface, Namespace.HandlerInterface] | [Namespace.HandlerInterface];

    pipe(handlers, A.map((x) => x.getNode()), H.appendChildListTo(this.base.getNode()));

    pipe(handlers, A.map(this.moveElementTo(currents)));

    return (handlers);
  };

  private readonly renderScale: Namespace.RenderScale = () => {
    const {container, scaleOptions} = this.props;

    const {currents, orientation, range, connectType, step} = this.state;

    const ofScale = Scale.of;

    const scaleProps: Namespace.ScaleProps = {
      container,
      orientation,
      range,
      connectType,
      step,
      withValue: scaleOptions.withValue,
      showValueEach: scaleOptions.showValueEach,
      bemBlockClassName: this.getBemBlockClassName(),
      onClick: this.handleClick
    };

    const scale = pipe(scaleProps, ofScale);

    H.appendTo(this.base.getNode())(scale.getNode());

    this.moveElementTo(currents)(scale);

    return (scale);
  };

  private handleDrag: Namespace.HandleDrag = (type) => (delta) => {
    const {onChange} = this.props;

    const head = pipe(this.state, H.prop('currents'), NEA.head);

    const last = pipe(this.state, H.prop('currents'), NEA.last);

    pipe(type === 'start'
      ? [pipe(head, H.add(delta)), last] : type === 'single'
        ? [pipe(head, H.add(delta))] : [head, pipe(last, H.add(delta))], onChange);
  };

  private readonly moveHandlersTo: Namespace.MoveHandlersTo = (currents) => {
    pipe(this.connects, A.map(this.moveElementTo(currents)));

    pipe(this.handlers, A.map(this.moveElementTo(currents)));

    if (this.scale) {
      pipe(this.scale, this.moveElementTo(currents));
    }
  };

  private readonly handleClick: Namespace.HandleClick = (coord) => {
    const {onChange} = this.props;

    const head = pipe(this.state, H.prop('currents'), NEA.head);
    const last = pipe(this.state, H.prop('currents'), NEA.last);

    const deltaHead = pipe(head, H.sub(coord), Math.abs);
    const deltaLast = pipe(last, H.sub(coord), Math.abs);

    onChange(A.size(this.state.currents) === 2
      ? deltaHead <= deltaLast
        ? [coord, last] : deltaLast < deltaHead
          ? [head, coord] : [head, last] : [coord]);
  }
}

export default View;



