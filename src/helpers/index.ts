import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';

//

export const trace = <Type>(x: Type) => {
  console.log(x);

  return (x);
};

//

export const toString = (x: unknown) => `${x}`;

export const prop = <Obj, Key extends keyof Obj>(key: Key) => (object: Obj) => object[key];

export const ident = <Type>(x: Type) => x;

export const callWith = <Function extends { (...args: unknown[] & Parameters<Function>): ReturnType<Function> }>(
  ...args: Parameters<Function>
) => (
  fn: Function
) => fn(...args);

export const instantiateWith = <Class extends { new(...params: unknown[] & ConstructorParameters<Class>): InstanceType<Class> }>(
  ...params: ConstructorParameters<Class>
) => (
  Func: Class
) => new Func(...params);

export const switchCases = <Case extends [Tag, F.Lazy<Value>], Tag, Value>(cases: Case[], def: F.Lazy<Value>) => (tag: Tag) =>
  pipe(cases, A.findLast(([key]) => key === tag), O.fold<Case, Value>(() => def(), ([_, value]) => value()));

//

export const eq = <Type>(x: Type) => (y: Type) => x === y;

export const not = (x: boolean) => !x;

//

export const sub = (x: number) => (y: number) => y - x;

export const add = (x: number) => (y: number) => x + y;

export const dec = (x: number) => sub(1)(x);

export const inc = (x: number) => add(1)(x);

export const div = (x: number) => (y: number) => y / x;

export const mult = (x: number) => (y: number) => x * y;

export const negate = (x: number) => mult(x)(-1);

export const half = (x: number) => div(2)(x);

export const percentage = (x: number) => (y: number) => pipe(y, div(x), mult(100));

export const remainder = (x: number) => (y: number) => y % x;

//

export const nthOrNone = <Type>(n: number, none: Type) => (xs: Type[]) => pipe(xs, A.lookup(n), O.getOrElse(F.constant(none)));

export const subAdjacent = (idx: number) => (xs: number[]) => {
  const current = nthOrNone(idx, NaN)(xs);

  const prev = nthOrNone(dec(idx), NaN)(xs);

  return (sub(prev)(current));
};

export const narrowTuple = <Args extends unknown[]>(...args: Args): Args => A.map((x) => x as typeof x)([...args]) as Args;

//

export const node = <NodeName extends keyof HTMLElementTagNameMap>(nodeName: NodeName) => document.createElement<NodeName>(nodeName);

export const appendTo = (parent: Node) => <T extends Node>(node: T) => parent.appendChild(node);

export const addClassList = (classList: string[]) => <Node extends Element>(node: Node) => {
  node.classList.add(...classList);

  return (node);
};

export const removeClassList = (classList: string[]) => <Node extends Element>(node: Node) => {
  node.classList.remove(...classList);

  return (node);
};

export const setInlineStyle = (style: string) => <Node extends HTMLElement>(node: Node) => {
  node.style.cssText = style;

  return (node);
};

export const setInnerText = (text: string) => <Node extends HTMLElement>(node: Node) => {
  node.innerText = text;

  return (node);
};

export const setAttribute = (attrName: string, value: string) => <Node extends HTMLElement>(node: Node) => {
  node.setAttribute(attrName, value);

  return (node);
};

export const addEventListener = <EventKey extends keyof HTMLElementEventMap>(
  event: EventKey, callback: (event: HTMLElementEventMap[EventKey]) => any
) => <Target extends EventTarget>(target: Target) => {
  target.addEventListener(event, callback as EventListenerOrEventListenerObject);

  return (target);
};

export const removeEventListener = <EventKey extends keyof HTMLElementEventMap>(
  event: EventKey, callback: (event: HTMLElementEventMap[EventKey]) => any
) => <Target extends EventTarget>(target: Target) => {
  target.removeEventListener(event, callback as EventListenerOrEventListenerObject);

  return (target);
};

export const querySelector = <Node extends Element>(
  selector: string
) => (parent: ParentNode) => pipe(parent.querySelector<Node>(selector), O.fromNullable);

export const querySelectorAll = <Node extends Element>(
  selector: string
) => (parent: ParentNode) => Array.from(parent.querySelectorAll<Node>(selector));