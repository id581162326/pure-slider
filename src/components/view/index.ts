/* libs */
import {__, add, compose, concat, cond, curry, dec, divide, equals, ifElse, last, map, multiply, nth, prop, subtract, T, toString} from 'ramda';
/* locals */
import View from './namespace';
import './styles.css';
/* helpers */
import {isDefined, mapIndexed, percentage, reduceIndexed, subtractAdjacent} from '../../globals/helpers';

/* prop helpers */

const container = prop('container');
const currents = prop('currents');
const min = prop('min');
const max = prop('max');
const tooltipOptions = prop('tooltipOptions');
const intervals = prop('intervals');
const orientation = prop('orientation');
const classes = prop('classes');
const handlers = prop('handlers');
const connects = prop('connects');
const tooltips = prop('tooltips');
const length = prop('length');
const offsetWidth = prop('offsetWidth');
const offsetHeight = prop('offsetHeight');
const alwaysShown = prop('alwaysShown');

/* dom helpers */

type AddClassList = (classList: string[], node: HTMLElement) => HTMLElement;

export const addClassList = curry((function (classList, node) {
  node.classList.add(...classList);

  return (node);
}) as AddClassList);

type RemoveClassList = (classList: string[], node: HTMLElement) => HTMLElement;

export const removeClassList = curry((function (classList: string[], node: HTMLElement): HTMLElement {
  node.classList.remove(...classList);

  return (node);
}) as RemoveClassList);

type AddInnerText = (string: string, node: HTMLElement) => HTMLElement;

export const addInnerText = curry((function (string, node) {
  node.innerText = string;

  return (node);
}) as AddInnerText);

type AddInlineStyle = (string: string, node: HTMLElement) => HTMLElement;

export const addInlineStyle = curry((function (style, node) {
  node.style.cssText = style;

  return (node);
}) as AddInlineStyle);

type AppendTo = (parent: HTMLElement, node: HTMLElement) => HTMLElement;

export const appendTo = curry((function (parent, node) {
  parent.append(node);

  return (node);
}) as AppendTo);

type Template = (tagName: keyof HTMLElementTagNameMap, classList: string[]) => HTMLDivElement;

export const template = ((tagName, classList) => {
  const node = document.createElement(tagName);

  addClassList(classList, node);

  return (node);
}) as Template;

/* nodes helpers */

type GetClassList = (key: View.NodeKeys, props: View.Props) => string[];

const getClassList = curry(((key, props) => ifElse(
  isDefined,
  () => [
    `pure-slider__${key}`,
    `pure-slider__${key}_orientation_${orientation(props)}`,
    `${classes(props)[key]}`,
    `${classes(props)[key]}_orientation_${orientation(props)}`
  ],
  () =>[
    `pure-slider__${key}`,
    `pure-slider__${key}_orientation_${orientation(props)}`
  ]
)(prop(key, classes(props)))) as GetClassList);

type Node = (key: View.NodeKeys, props: View.Props) => HTMLDivElement | HTMLSpanElement;

const node = curry(((key, props) => cond([
  [equals('tooltip'), () => template('span', getClassList(key, props))],
  [T, () => template('div', getClassList(key, props))]
])(key)) as Node);

const handler = node('handler');

const connect = node('connect');

const base = node('base');

const tooltip = node('tooltip');

/* dimension helpers */

type Range = (props: View.Props) => number;

const range = ((props) => subtract(max(props), min(props))) as Range;

type NodeSize = (props: View.Props, node: HTMLElement) => number;

const nodeSize = curry(((props, node) => cond([
  [equals('horizontal'), () => offsetWidth(node)],
  [equals('vertical'), () => offsetHeight(node)]
])(orientation(props))) as NodeSize);

type ContainerSize = (props: View.Props) => number;

const containerSize = ((props) => nodeSize(props, container(props))) as ContainerSize;

type NumToPx = (containerSize: number, range: number, num: number) => number;

const numToPx = curry(((containerSize, range, num) => compose<number, number, number>(
  divide(__, range),
  multiply(num)
)(containerSize)) as NumToPx)

/* tooltip render logic */

type TooltipVisibility = (props: boolean, tooltip: HTMLDivElement) => HTMLDivElement;

const tooltipVisibility = curry(((shown, tooltip) => ifElse(
  equals(true),
  () => addClassList([`pure-slider__tooltip_shown`], tooltip),
  () => tooltip
)(shown)) as TooltipVisibility);

type RenderTooltips = (props: View.Props, handlers: View.Nodes['handlers']) => HTMLDivElement[];

const renderTooltips = curry(((props, handlers) => mapIndexed((handler: View.Handler, index: number) => compose<View.Handler, View.Tooltip, View.Tooltip, View.Tooltip>(
  tooltipVisibility(alwaysShown(tooltipOptions(props))),
  addInnerText(compose(toString, nth(index))(currents(props))),
  appendTo(handler)
)(tooltip(props)), handlers)) as RenderTooltips);

/* tooltips update logic */

type UpdateTooltips = (props: View.Props, tooltips: View.Nodes['tooltips']) => HTMLDivElement[];

const updateTooltips = ((props, tooltips) => mapIndexed((tooltip: View.Tooltip, index: number) => compose(
  addInnerText(__, tooltip),
  toString,
  nth(index)
)(currents(props)), tooltips)) as UpdateTooltips;

/* handler render logic */

type HandlerSize = (props: View.Props, handler: View.Handler) => number;

const handlerSize = ((props, handler) => nodeSize(props, handler)) as HandlerSize;

type HandlerPos = (props: View.Props, current: number, handler: HTMLDivElement) => number;

const handlerPos = curry(((props, current, handler) => compose<number, number, number, number, number>(
  percentage(containerSize(props)),
  subtract(__, divide(handlerSize(props, handler), 2)),
  numToPx(containerSize(props), range(props)),
  subtract(__, min(props))
)(current)) as HandlerPos);

type MoveHandler = (props: View.Props, current: number, handler: HTMLDivElement) => HTMLDivElement;

const moveHandler = curry(((props, current, handler) => cond([
  [equals('horizontal'), () => addInlineStyle(`left: ${handlerPos(props, current, handler)}%;`, handler)],
  [equals('vertical'), () => addInlineStyle(`bottom: ${handlerPos(props, current, handler)}%;`, handler)]
])(orientation(props))) as MoveHandler);


type RenderHandler = (props: View.Props, current: number, base: HTMLDivElement) => HTMLDivElement;

const renderHandler = curry(((props, current, base) => compose<HTMLDivElement, HTMLDivElement, HTMLDivElement>(
  moveHandler(props, current),
  appendTo(__, handler(props))
)(base)) as RenderHandler);

type RenderHandlers = (props: View.Props, base: HTMLDivElement) => HTMLDivElement[];

const renderHandlers = curry(((props, base) => map(renderHandler(props, __, base), currents(props))) as RenderHandlers);

/* connects update logic */

type UpdateHandlers = (props: View.Props, handlers: View.Nodes['handlers']) => View.Nodes['handlers'];

const updateHandlers = curry(((props, handlers) => mapIndexed((handler: HTMLDivElement, index: number) => compose(
  moveHandler(props, __, handler),
  nth(index)
)(currents(props)), handlers)) as UpdateHandlers);

/* connect render logic */

type FirstConnectPos = () => 0;

const firstConnectPos: FirstConnectPos = () => 0;

type LastConnectPos = (props: View.Props) => number;

const lastConnectPos: LastConnectPos = (props) => compose<number[], number, number, number>(
  percentage(range(props)),
  subtract(__, min(props)),
  last
)(currents(props));

type InnerConnectPos = (props: View.Props, index: number) => number;

const innerConnectPos = curry(((props, index) => compose<number[], number, number, number>(
  percentage(range(props)),
  subtract(__, min(props)),
  nth(dec(index))
)(currents(props))) as InnerConnectPos);

type ConnectPos = (props: View.Props, index: number) => number;

const connectPos = curry(((props, index) => cond([
  [equals(0), firstConnectPos],
  [compose(equals, length)(currents(props)), () => lastConnectPos(props)],
  [T, innerConnectPos(props)]
])(index)) as ConnectPos);

type FirstConnectSize = (props: View.Props) => number;

const firstConnectSize: FirstConnectSize = (props) => compose<number[], number, number>(
  percentage(range(props)),
  nth(0)
)(currents(props));

type LastConnectSize = (props: View.Props) => number;

const lastConnectSize: LastConnectSize = (props) => compose<number[], number, number, number>(
  percentage(range(props)),
  subtract(max(props)),
  last
)(currents(props));

type InnerConnectSize = (props: View.Props, index: number) => number;

const innerConnectSize = curry(((props, index) => compose<number[], number, number>(
  percentage(range(props)),
  subtractAdjacent(index)
)(currents(props))) as InnerConnectSize);

type ConnectSize = (props: View.Props, index: number) => number;

const connectSize = curry(((props, index) => cond([
  [equals(0), () => firstConnectSize(props)],
  [equals(compose<View.Props, boolean[], number, number>(dec, length, intervals)(props)), () => lastConnectSize(props)],
  [T, () => innerConnectSize(props, index)]
])(index)) as ConnectSize);

type MoveConnect = (props: View.Props, index: number, connect: HTMLDivElement) => HTMLDivElement;

const moveConnect = curry(((props, index, connect) => cond([
  [equals('horizontal'), () => addInlineStyle(concat(
    `left: ${connectPos(props, index)}%;`,
    `max-width: ${connectSize(props, index)}%;`), connect)],
  [equals('vertical'), () => addInlineStyle(concat(
    `bottom: ${connectPos(props, index)}%;`,
    `max-height: ${connectSize(props, index)}%;`), connect)]
])(orientation(props))) as MoveConnect);

type RenderConnect = (props: View.Props, index: number, base: HTMLDivElement) => HTMLDivElement;

const renderConnect = curry(((props, index, base: HTMLDivElement) => compose<HTMLDivElement, HTMLDivElement, HTMLDivElement>(
  moveConnect(props, index),
  appendTo(base))(connect(props))) as RenderConnect);

type RenderConnectsReducer = (props: View.Props, base: HTMLDivElement, acc: HTMLDivElement[], hasInterval: boolean, index: number) => HTMLDivElement[];

const renderConnectsReducer = curry(((props, base, acc, hasInterval, index) => ifElse(
  equals(true),
  () => concat(acc, [renderConnect(props, index, base)]),
  () => acc
)(hasInterval)) as RenderConnectsReducer);

type RenderConnects = (props: View.Props, base: HTMLDivElement) => HTMLDivElement[];

const renderConnects = curry(((props, base) => reduceIndexed(renderConnectsReducer(props, base),
  [], intervals(props))) as RenderConnects);

/* connects update logic */

type MoveConnectsReducer = (props: View.Props, connects: View.Nodes['connects'], connectIndex: number, hasInterval: boolean, intervalIndex: number) => void;

const updateConnectsReducer = curry(((props, connects, connectIndex: number, hasInterval: boolean, intervalIndex: number) => ifElse(
  equals(true),
  () => compose(
    () => add(1, connectIndex),
    moveConnect(props, intervalIndex),
    (index: number) => nth(index, connects)
  )(connectIndex),
  () => connectIndex
)(hasInterval)) as MoveConnectsReducer);

type UpdateConnects = (props: View.Props, nodes: View.Nodes['connects']) => void;

const updateConnects = curry(((props, connects) => reduceIndexed(updateConnectsReducer(props, connects), 0, intervals(props))) as UpdateConnects);

/* view methods */

type Render = (props: View.Props) => View.Nodes;

const render = curry(((props) => {
  const newNodes: View.Nodes = {
    connects: [],
    handlers: [],
    tooltips: [],
    base: null
  };

  newNodes.base = appendTo(container(props), base(props));
  newNodes.connects = renderConnects(props, newNodes.base);
  newNodes.handlers = renderHandlers(props, newNodes.base);
  newNodes.tooltips = renderTooltips(props, newNodes.handlers);

  return (newNodes);
}) as Render);

type UpdateSlider = (props: View.Props, nodes: View.Nodes) => void;

const updateSlider = curry(((props, nodes) => {
  updateHandlers(props, handlers(nodes));
  updateTooltips(props, tooltips(nodes));
  updateConnects(props, connects(nodes));
}) as UpdateSlider);

type Destroy = (props: View.Props) => void;

const destroy = curry(((props) => {
  const emptyNodes: View.Nodes = {
    connects: [],
    handlers: [],
    tooltips: [],
    base: null
  }

  container(props).innerHTML = '';

  removeClassList(['pure-slider'], container(props));

  return (emptyNodes);
}) as Destroy);

/* view */

export default class implements View.Interface {
  public props: View.Props = {
    min: 1,
    max: 10,
    currents: [1],
    intervals: [false, false],
    orientation: 'horizontal',
    container: null,
    scaleOptions: {
      enabled: true,
      measure: 1
    },
    tooltipOptions: {
      enabled: false,
      alwaysShown: false,
      prefix: 'prefix ',
      postfix: ' postfix'
    },
    classes: {}
  };
  public nodes: View.Nodes = {
    connects: [],
    handlers: [],
    tooltips: [],
    base: null
  };

  public render = () => this.nodes = render(this.props);
  public destroy = () => this.nodes = destroy(this.props);
  public setProps = (newProps: View.Props) => this.props = newProps;
  public updateSlider = (newCurrents: View.Props['currents']) => {
    this.props = {...this.props, currents: newCurrents};

    updateSlider(this.props, this.nodes);
  };
}