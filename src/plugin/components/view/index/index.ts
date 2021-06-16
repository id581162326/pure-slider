import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {constant, pipe} from 'fp-ts/function';

import * as H from '../../../../helpers';

import Connect from '../components/connect';
import Handle from '../components/handle';
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

        A.size(oldCurrents) !== A.size(action.currents) ? this.reRender() : this.moveHandlesTo(action.currents);

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
    this.handles = this.renderHandles();
    this.connects = this.renderConnects();
    this.scale = this.renderScale();

    if (!state.showScale) {
      this.destroyElement(this.scale);
    }
  }

  private container: Namespace.ContainerInterface;
  private base: Namespace.BaseInterface;
  private connects: Namespace.ConnectInterface[];
  private handles: [Namespace.HandleInterface, Namespace.HandleInterface] | [Namespace.HandleInterface];
  private scale: Namespace.ScaleInterface;

  private readonly getBemBlockClassName: Namespace.GetBemBlockClassName = () => ({
    base: 'pure-slider',
    theme: pipe(this.props, H.prop('themeBemBlockClassName'), O.fromNullable, O.getOrElse(constant('-slider')))
  });

  private readonly moveElementTo: Namespace.MoveElementTo = (currents) => (element) => {
    element.moveTo(currents);

    return (element);
  };

  private readonly getElementNode: Namespace.GetElementNode = (element) => element.getNode();

  private readonly destroyElement: Namespace.DestroyElement = (element) => {
    element.destroy();
  };

  private readonly destroy: Namespace.Destroy = () => {
    A.map(this.destroyElement)([
      this.scale, this.base, this.container,
      ...this.handles,
      ...this.connects]);
  };

  private readonly render: Namespace.Render = () => {
    this.container = this.renderContainer();
    this.base = this.renderBase();
    this.scale = this.renderScale();
    this.handles = this.renderHandles();
    this.connects = this.renderConnects();

    if (!this.state.showScale) {
      this.destroyElement(this.scale);
    }
  };

  private readonly reRender: Namespace.ReRender = () => {
    this.destroy();
    this.render();
  };

  private readonly renderContainer: Namespace.RenderContainer = () => {
    const {container} = this.props;
    const {orientation, range} = this.state;

    const containerProps: Namespace.ContainerProps = {
      orientation, range, container,
      bemBlockClassName: this.getBemBlockClassName()
    };

    return (pipe(containerProps, Container.of));
  };

  private readonly renderBase: Namespace.RenderBase = () => {
    const {container} = this.props;
    const {orientation, range} = this.state;

    const baseProps: Namespace.BaseProps = {
      orientation, range, container,
      bemBlockClassName: this.getBemBlockClassName(),
      onClick: this.handleClick
    };

    const base = pipe(baseProps, Base.of);

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
      container, orientation, range,
      bemBlockClassName: this.getBemBlockClassName(),
      type: connectType === 'outer-range' || connectType === 'inner-range'
        ? idx === 0 ? 'from-start' : idx === 2 ? 'to-end' : 'inner'
        : idx === 0 ? 'from-start' : 'to-end'
    });

    const initConnect = (idx: number): Namespace.ConnectInterface => pipe(idx, getConnectProps, Connect.of);

    const connects = A.map(initConnect)(connectMap);

    pipe(connects, A.map(this.getElementNode), pipe(this.base, this.getElementNode, H.appendChildListTo));

    return (pipe(connects, A.map(this.moveElementTo(currents))));
  };

  private readonly renderHandles: Namespace.RenderHandles = () => {
    const {container, tooltipOptions} = this.props;
    const {range, currents, orientation, step, showTooltips} = this.state;

    const getHandleProps = (idx: number): Namespace.HandleProps => ({
      container, orientation, range, step,
      showTooltip: showTooltips,
      bemBlockClassName: this.getBemBlockClassName(),
      tooltipAlwaysShown: tooltipOptions ? tooltipOptions.alwaysShown : false,
      type: A.size(currents) === 2 ? idx === 0 ? 'start' : 'end' : 'start',
      onDrag: this.handleDrag
    });

    const initHandle = (idx: number): Namespace.HandleInterface => pipe(idx, getHandleProps, Handle.of);

    const handles = A.mapWithIndex(initHandle)(currents);

    pipe(handles, A.map(this.getElementNode), pipe(this.base, this.getElementNode, H.appendChildListTo));

    return (pipe(handles, A.map(this.moveElementTo(currents))) as [Namespace.HandleInterface, Namespace.HandleInterface] | [Namespace.HandleInterface]);
  };

  private readonly renderScale: Namespace.RenderScale = () => {
    const {container, scaleOptions} = this.props;
    const {currents, orientation, range, connectType, step} = this.state;

    const scaleProps: Namespace.ScaleProps = {
      container, orientation, range, step,
      type: connectType,
      withValue: scaleOptions.withValue,
      showValueEach: scaleOptions.showValueEach,
      bemBlockClassName: this.getBemBlockClassName(),
      onClick: this.handleClick
    };

    const scale = pipe(scaleProps, Scale.of);

    pipe(scale, this.getElementNode, pipe(this.base, this.getElementNode, H.appendTo))

    return (this.moveElementTo(currents)(scale) as Namespace.ScaleInterface);
  };

  private handleDrag: Namespace.HandleDrag = (type) => (delta) => {
    const {onChange} = this.props;
    const {currents} = this.state;

    pipe(currents, NEA.mapWithIndex((idx, coord: number) =>
      type === 'start' && idx === 0 ? pipe(coord, H.add(delta)) :
        type === 'end' && idx === 1 ? pipe(coord, H.add(delta)) : coord
    ) as (x: Namespace.Currents) => Namespace.Currents, onChange);
  };

  private readonly moveHandlesTo: Namespace.MoveHandlesTo = (currents) => {
    A.map(this.moveElementTo(currents))([
      ...this.connects,
      ...this.handles,
      ...(this.scale ? [this.scale] : [])]);
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
  };
}

export default View;



