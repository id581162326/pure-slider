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
        this.state = {...this.state, orientation: this.state.orientation === 'horizontal' ? 'vertical' : 'horizontal'};

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
      this.scale.destroy();
    }

    // move handlers on load for correct handler's offset calculation

    H.addEventListener('load', () => this.moveHandlersTo(state.currents))(document);
  }

  private container: Namespace.Container;

  private base: Namespace.Base;

  private connects: Namespace.Connect[];

  private handlers: [Namespace.Handler, Namespace.Handler] | [Namespace.Handler];

  private scale: Namespace.Scale;

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

  private readonly moveElementTo: Namespace.MoveElementTo = (currents) => (element) => {
    element.moveTo(currents);

    return (element);
  };

  private readonly destroy = () => {
    const destroyElement = (x: Namespace.Elements) => x.destroy();

    A.map(destroyElement)(this.handlers);

    A.map(destroyElement)(this.connects);

    destroyElement(this.scale);

    destroyElement(this.base);

    destroyElement(this.container);
  }

  private readonly render = () => {
    this.container = this.renderContainer();

    this.base = this.renderBase();

    this.handlers = this.renderHandlers();

    this.scale = this.renderScale();

    this.connects = this.renderConnects();

    if (!this.state.showScale) {
      this.scale.destroy();
    }
  };

  private readonly reRender = () => {
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

    const {orientation, range, currents} = this.state;

    const baseProps: Namespace.BaseProps = {
      bemBlockClassName: this.getBemBlockClassName(),
      orientation,
      range,
      container,
      initialClickType: pipe(currents, A.size) === 2 ? 'start' : 'single',
      onClick: this.handleClick
    };

    const ofBase = Base.of;

    return (pipe(baseProps, ofBase, this.appendElementTo(this.container)));
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

    const initHandler = (idx: number): Namespace.Handler => pipe(
      idx,
      getHandlerProps,
      ofHandler,
      this.appendElementTo(this.base),
      this.moveElementTo(currents)
    );

    return (A.mapWithIndex(initHandler)(currents) as [Namespace.Handler, Namespace.Handler] | [Namespace.Handler]);
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

    return (pipe(scaleProps, ofScale, this.moveElementTo(currents), this.appendElementTo(this.base)));
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

    const deltaHead = pipe(head, H.sub(coord), H.abs);

    const deltaLast = pipe(last, H.sub(coord), H.abs);

    onChange(A.size(this.state.currents) === 2
      ? deltaHead <= deltaLast
        ? [coord, last] : deltaLast < deltaHead
          ? [head, coord] : [head, last] : [coord]);
  }
}

export default View;



