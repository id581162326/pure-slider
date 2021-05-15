import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';

import {constant, pipe} from 'fp-ts/function';

// debug helpers

type throwErrorSignature = (name: string) => (message: string) => void;
export const throwError: throwErrorSignature = (name) => (message) => {
  const error = new Error();

  error.name = name;
  error.message = message;

  throw error;
};

type traceSignature = <T>(x: T) => T;
export const trace: traceSignature = (x) => {
  console.log(x);

  return (x);
};

// misc helpers

type toStringSignature = (x: number) => string;
export const toString: toStringSignature = (x) => x.toString();

type propSignature = <T>(k: keyof T) => (o: T) => T[keyof T];
export const prop: propSignature = (k) => (o) => o[k];

type identSignature = <T>(x: T) => T;
export const ident: identSignature = (x) => x;

// array helpers

type lengthSignature = (xs: unknown[]) => number;
export const length: lengthSignature = (xs) => xs.length;

type nthOrNoneSignature = <T>(n: number, none: T) => (xs: T[]) => T;
export const nthOrNone: nthOrNoneSignature = (n, none) => (xs) => pipe(xs, A.lookup(n), O.getOrElse(constant(none)));

type lastOrNoneSignature = <T>(none: T) => (xs: T[]) => T;
export const lastOrNone: lastOrNoneSignature = (none) => (xs) => pipe(xs, A.last, O.getOrElse(constant(none)));

type headOrNoneSignature = <T>(none: T) => (xs: T[]) => T;
export const headOrNone: headOrNoneSignature = (none) => (xs) => pipe(xs, A.head, O.getOrElse(constant(none)));

// math helpers

type absSignature = (x: number) => number;
export const abs: absSignature = (x) => Math.abs(x);

type subSignature = (x: number) => (y: number) => number;
export const sub: subSignature = (x) => (y) => y - x;

type addSignature = (x: number) => (y: number) => number;
export const add: addSignature = (x) => (y) => x + y;

type decSignature = (x: number) => number;
export const dec: decSignature = (x) => sub(1)(x);

type incSignature = (x: number) => number;
export const inc: incSignature = (x) => add(1)(x);

type divSignature = (x: number) => (y: number) => number;
export const div: divSignature = (x) => (y) => y / x;

type multSignature = (x: number) => (y: number) => number;
export const mult: multSignature = (x) => (y) => x * y;

type halfSignature = (x: number) => number;
export const half: halfSignature = (x) => div(2)(x);

type percentSignature = (x: number) => (y: number) => number;
export const percent: percentSignature = (x) => (y) => pipe(y, div(x), mult(100));

type roundSignature = (x: number) => number;
export const round: roundSignature = (x) => Math.round(x);

// DOM helpers

type nodeSignature = <T extends keyof HTMLElementTagNameMap>(n: T) => HTMLElementTagNameMap[T];
export const node: nodeSignature = (n) => document.createElement(n);

type appendToSignature = <T extends HTMLElement, K extends HTMLElement>(p: T) => (c: K) => K
export const appendTo: appendToSignature = (p) => (c) => {
  p.appendChild(c);

  return (c);
};

type addClassListSignature = <T extends HTMLElement>(xs: string[]) => (n: T) => T;
export const addClassList: addClassListSignature = (xs) => (n) => {
  n.classList.add(...xs);

  return (n);
};

type removeClassListSignature = <T extends HTMLElement>(xs: string[]) => (n: T) => T;
export const removeClassList: removeClassListSignature = (xs) => (n) => {
  n.classList.remove(...xs);

  return (n);
};

type setInlineStyleSignature = <T extends HTMLElement>(x: string) => (n: T) => T;
export const setInlineStyle: setInlineStyleSignature = (x) => (n) => {
  n.style.cssText = x;

  return (n);
};

type setInnerTextSignature = <T extends HTMLElement>(x: string) => (n: T) => T;
export const setInnerText: setInnerTextSignature = (x) => (n) => {
  n.innerText = x;

  return (n);
};

type offsetWidthSignature = <T extends HTMLElement>(n: T) => number;
export const offsetWidth: offsetWidthSignature = (n) => n.offsetWidth;

type offsetHeightSignature = <T extends HTMLElement>(n: T) => number;
export const offsetHeight: offsetHeightSignature = (n) => n.offsetHeight;

type addEventListenerSignature = <T extends keyof HTMLElementEventMap,
  K extends EventTarget>(t: T, fn: (e: HTMLElementEventMap[T]) => any) => (n: K) => K;
export const addEventListener: addEventListenerSignature = (t, fn) => (n) => {
  n.addEventListener(t, fn as EventListener);

  return (n);
};

type removeEventListenerSignature = <T extends keyof HTMLElementEventMap,
  K extends EventTarget>(t: T, fn: (e: HTMLElementEventMap[T]) => any) => (n: K) => K;
export const removeEventListener: removeEventListenerSignature = (t, fn) => (n) => {
  n.removeEventListener(t, fn as EventListener);

  return (n);
};