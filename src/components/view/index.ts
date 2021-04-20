/* ramda */
import {
  compose,
  curry,
  ifElse,
  cond,
  map,
  equals,
  T,
  prop,
  concat,
  subtract,
  dec,
  last,
  nth,
  divide,
  multiply,
  always,
  add,
  __
} from 'ramda';
/* locals */
import View from './namespace';
import './styles.css';
/* global helpers */
import {forEachIndexed, isDefined, mapIndexed, reduceIndexed, subtractAdjacent} from '../../globals/helpers';

/* prop helpers */

const containerProp = prop('container');
const currentsProp = prop('currents');
const minProp = prop('min');
const maxProp = prop('max');
const tooltipProp = prop('tooltip');
const intervalsProp = prop('intervals');
const orientationProp = prop('orientation');
const classesProp = prop('classes');

/* dom helpers */

type AddClassList = (classList: string[], node: HTMLElement) => HTMLElement;

const addClassList = curry((function (classList, node) {
  node.classList.add(...classList);
  
  return (node);
}) as AddClassList);

type RemoveClassList = (classList: string[], node: HTMLElement) => HTMLElement;

const removeClassList = curry((function (classList: string[], node: HTMLElement): HTMLElement {
  node.classList.remove(...classList);
  
  return (node);
}) as RemoveClassList);

type AddInnerText = (string: string, node: HTMLElement) => HTMLElement;

const addInnerText = curry((function (string, node) {
  node.innerText = string;
  
  return (node);
}) as AddInnerText);

type AddInlineStyle = (string: string, node: HTMLElement) => HTMLElement;

const addInlineStyle = curry((function (style, node) {
  node.style.cssText = style;
  
  return (node);
}) as AddInlineStyle);

type Template = (tagName: keyof HTMLElementTagNameMap) => () => HTMLElement;

const template: Template = ((tagName) => () => document.createElement(tagName));

const div = template('div');

type AddDefaultClasses = (props: View.Props, key: View.NodeKeys, node: HTMLElement) => HTMLElement;

const addDefaultClasses = curry(((props, key, node) => addClassList([
  `pure-slider__${key}`,
  `pure-slider__${key}_orientation_${orientationProp(props)}`], node)) as AddDefaultClasses);

type AddCustomClasses = (props: View.Props, key: View.NodeKeys, custom: string, node: HTMLElement) => HTMLElement;

const addCustomClasses = curry(((props, key, custom, node) => compose<HTMLElement, HTMLElement, HTMLElement>(
  addClassList([custom, `${custom}_orientation_${orientationProp(props)}`]),
  addDefaultClasses(props, key)
)(node)) as AddCustomClasses);

type Node = (key: View.NodeKeys, props: View.Props) => HTMLDivElement;

const node = curry(((key, props) => ifElse(
  isDefined,
  addCustomClasses(props, key, __, div()),
  always(addDefaultClasses(props, key, div()))
)(prop(key, classesProp(props)))) as Node);

const handler = node('handler');
const connect = node('connect');
const base = node('base');
const tooltip = node('tooltip');

type AppendTo = (parent: HTMLElement, node: HTMLElement) => HTMLElement;

const appendTo = curry((function (parent, node) {
  parent.append(node);
  
  return (node);
}) as AppendTo);

type AppendNode = (props: View.Props, parent: HTMLDivElement) => HTMLDivElement;

const appendTooltip = curry(((props, parent) => appendTo(parent, tooltip(props)) as HTMLDivElement) as AppendNode);
const appendHandler = curry(((props, parent) => appendTo(parent, handler(props)) as HTMLDivElement) as AppendNode);
const appendConnect = curry(((props, parent) => appendTo(parent, connect(props)) as HTMLDivElement) as AppendNode);
const appendBase = curry(((props, parent) => appendTo(parent, base(props)) as HTMLDivElement) as AppendNode);

/* dimension helpers */

type Range = (props: View.Props) => number;

const range: Range = (props) => subtract(maxProp(props), minProp(props));

type ElementSize = (props: View.Props, container: HTMLElement) => number;

const elementSize = curry(((props, element) => cond([
  [equals('horizontal'), () => prop('offsetWidth', element)],
  [equals('vertical'), () => prop('offsetHeight', element)],
])(orientationProp(props))) as ElementSize);

type Correct = (props: View.Props, num: number) => number;

const correct = curry(((props, num) => subtract(num, minProp(props))) as Correct);

type numToPx = (props: View.Props, num: number) => number;

const numToPx = curry(((props, num) => compose<View.Props['container'], number, number, number>(
  divide(__, range(props)),
  multiply(num),
  elementSize(props)
)(containerProp(props))) as numToPx)

type pxToPercentage = (props: View.Props, px: number) => number;

const pxToPercentage = curry(((props, px) => compose<View.Props['container'], number, number, number>(
  multiply(100),
  divide(px),
  elementSize(props)
)(containerProp(props))) as pxToPercentage);

/* tooltip render logic */

type TooltipVisibility = (props: View.Props, tooltip: HTMLDivElement) => HTMLDivElement;

const tooltipVisibility = curry(((props, tooltip) => ifElse(
  equals(true),
  () => addClassList([`pure-slider__tooltip_shown`], tooltip),
  () => tooltip
)(prop('alwaysShown', tooltipProp(props)))) as TooltipVisibility);

type RenderTooltip = (props: View.Props, handler: HTMLDivElement, index: number) => HTMLDivElement;

const renderTooltip = curry(((props, handler, index) => compose<HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement>(
  tooltipVisibility(props),
  addInnerText(nth(index, currentsProp(props)).toString()),
  appendTooltip(props),
)(handler)) as RenderTooltip);

type RenderTooltips = (props: View.Props, handlers: HTMLDivElement[]) => HTMLDivElement[];

const renderTooltips = curry(((props, handlers) => mapIndexed(renderTooltip(props), handlers)) as RenderTooltips);

/* handler render logic */

type HandlerPos = (props: View.Props, current: number, handler: HTMLDivElement) => number;

const handlerPos = curry(((props, current, handler) => compose<number, number, number, number, number>(
  pxToPercentage(props),
  subtract(__, divide(elementSize(props, handler) as number, 2)),
  numToPx(props),
  correct(props)
)(current)) as HandlerPos);

type MoveHandler = (props: View.Props, current: number, handler: HTMLDivElement) => HTMLDivElement;

const moveHandler = curry(((props, current, handler) => cond([
  [equals('horizontal'), () => addInlineStyle(`left: ${handlerPos(props, current, handler)}%;`, handler)],
  [equals('vertical'), () => addInlineStyle(`bottom: ${handlerPos(props, current, handler)}%;`, handler)]
])(orientationProp(props))) as MoveHandler);

type RenderHandler = (props: View.Props, current: number, base: HTMLDivElement) => HTMLDivElement;

const renderHandler = curry(((props, current, base) => compose<HTMLDivElement, HTMLDivElement, HTMLDivElement>(
  moveHandler(props, current),
  appendHandler(props)
)(base)) as RenderHandler);

type RenderHandlers = (props: View.Props, base: HTMLDivElement) => HTMLDivElement[];

const renderHandlers = curry(((props, base) => map(renderHandler(props, __, base), currentsProp(props))
) as RenderHandlers);

/* connect render logic */

type FirstConnectPos = () => 0;

const firstConnectPos: FirstConnectPos = () => 0;

type LastConnectPos = (props: View.Props) => number;

const lastConnectPos: LastConnectPos = (props) => compose<number[], number, number, number, number>(
  pxToPercentage(props),
  numToPx(props),
  correct(props),
  last
)(currentsProp(props));

type InnerConnectPos = (props: View.Props, index: number) => number;

const innerConnectPos = curry(((props, index) => compose<number[], number, number, number, number>(
  pxToPercentage(props),
  numToPx(props),
  correct(props),
  nth(dec(index))
)(currentsProp(props))) as InnerConnectPos);

type ConnectPos = (props: View.Props, index: number) => number;

const connectPos = curry(((props, index) => cond([
  [equals(0), firstConnectPos],
  [compose(equals, prop('length'))(currentsProp(props)), always(lastConnectPos(props))],
  [T, innerConnectPos(props)]
])(index)) as ConnectPos);

type FirstConnectSize = (props: View.Props) => number;

const firstConnectSize: FirstConnectSize = (props) => compose<number[], number, number, number>(
  pxToPercentage(props),
  numToPx(props),
  nth(0)
)(currentsProp(props));

type LastConnectSize = (props: View.Props) => number;

const lastConnectSize: LastConnectSize = (props) => compose<number[], number, number, number, number>(
  pxToPercentage(props),
  numToPx(props),
  subtract(maxProp(props)),
  last
)(currentsProp(props));

type InnerConnectSize = (props: View.Props, index: number) => number;

const innerConnectSize = curry(((props, index) => compose<number[], number, number, number>(
  pxToPercentage(props),
  numToPx(props),
  subtractAdjacent(index)
)(currentsProp(props))) as InnerConnectSize);

type ConnectSize = (props: View.Props, index: number) => number;

const connectSize = curry(((props, index) => cond([
  [equals(0), always(firstConnectSize(props))],
  [equals(dec(prop('length', intervalsProp(props)))), always(lastConnectSize(props))],
  [T, always(innerConnectSize(props, index))]
])(index)) as ConnectSize);

type MoveConnect = (props: View.Props, index: number, connect: HTMLDivElement) => HTMLDivElement;

const moveConnect = curry(((props, index, connect) => cond([
  [equals('horizontal'), () => addInlineStyle(concat(
    `left: ${connectPos(props, index)}%;`,
    `max-width: ${connectSize(props, index)}%;`), connect)],
  [equals('vertical'), () => addInlineStyle(concat(
    `bottom: ${connectPos(props, index)}%;`,
    `max-height: ${connectSize(props, index)}%;`), connect)]
])(orientationProp(props))) as MoveConnect);

type RenderConnect = (props: View.Props, index: number, base: HTMLDivElement) => HTMLDivElement;

const renderConnect = curry(((props, index, base: HTMLDivElement) => compose<HTMLDivElement, HTMLDivElement, HTMLDivElement>(
  moveConnect(props, index),
  appendConnect(props))(base)) as RenderConnect);

type ConnectsReducer = (props: View.Props, base: HTMLDivElement, acc: HTMLDivElement[], hasInterval: boolean, index: number) => HTMLDivElement[];

const connectReducer = curry(((props, base, acc, hasInterval, index) => ifElse(
  equals(true),
  () => concat(acc, [renderConnect(props, index, base)]),
  () => acc
)(hasInterval)) as ConnectsReducer);

type RenderConnects = (props: View.Props, base: HTMLDivElement) => HTMLDivElement[];

const renderConnects = curry(((props, base) => reduceIndexed(connectReducer(props, base),
  [], intervalsProp(props))) as RenderConnects);

/* view methods */

type Render = (props: View.Props, nodes: View.Nodes) => void;

const render = curry(((props, nodes) => {
  nodes.base = appendBase(props, containerProp(props));
  nodes.connects = renderConnects(props, nodes.base);
  nodes.handlers = renderHandlers(props, nodes.base);
  nodes.tooltips = renderTooltips(props, nodes.handlers);
}) as Render);

type MoveSlider = (props: View.Props, nodes: View.Nodes, currents: number[]) => void;

const moveSlider = curry(((props, nodes, currents) => {
  props.currents = currents;
  
  forEachIndexed((handler: HTMLDivElement, index: number) => moveHandler(props, nth(index, currents), handler), prop('handlers', nodes));
  forEachIndexed((tooltip: HTMLDivElement, index: number) => addInnerText(nth(index, currents).toString(), tooltip), prop('tooltips', nodes));
  reduceIndexed((connectIndex: number, hasInterval: boolean, intervalIndex: number) => ifElse(
    equals(true),
    () => compose(
      always(add(1, connectIndex)),
      moveConnect(props, intervalIndex),
      (index: number) => nth(index, prop('connects', nodes))
    )(connectIndex),
    () => connectIndex
  )(hasInterval), 0, intervalsProp(props));
}) as MoveSlider);

type Destroy = (props: View.Props, nodes: View.Nodes) => void;

const destroy = curry(((props, nodes) => {
  const container = containerProp(props);
  
  nodes.connects = [];
  nodes.handlers = [];
  nodes.tooltips = [];
  nodes.base = null;
  
  container.innerHTML = '';
  
  removeClassList(['pure-slider'], container);
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
    scale: {
      enabled: true,
      measure: 1
    },
    tooltip: {
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
  
  public render = () => render(this.props, this.nodes);
  public destroy = () => destroy(this.props, this.nodes);
  public setProps = (newProps: View.Props) => this.props = newProps;
  public moveSlider = (currents: View.Props['currents']) => moveSlider(this.props, this.nodes, currents);
}