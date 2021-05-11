import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';

import {constant, pipe} from 'fp-ts/function';


export const toString = (x: number): string => x.toString();

export const prop = <T>(k: keyof T): ((o: T) => T[keyof T]) => (o) => o[k];

export const nthOrNone = <T>(n: number, none: T): (xs: T[]) => T => (xs) => pipe(xs, A.lookup(n), O.getOrElse(constant(none)));

export const lastOrNone = <T>(none: T): (xs: T[]) => T => (xs) => pipe(xs, A.last, O.getOrElse(constant(none)));

export const headOrNone = <T>(none: T): (xs: T[]) => T => (xs) => pipe(xs, A.head, O.getOrElse(constant(none)));


export const sub = (x: number): (y: number) => number => (y) => pipe(y, O.fromNullable, O.getOrElse(constant(0))) - x;

export const add = (x: number): (y: number) => number => y => x + pipe(y, O.fromNullable, O.getOrElse(constant(0)));

export const dec = (x: number): number => sub(1)(x);

export const inc = (x: number): number => add(1)(x);

export const div = (x: number): (y: number) => number => (y) => y / x;

export const mult = (x: number): (y: number) => number => (y) => x * y;

export const half = (x: number): number => div(2)(x);

export const percent = (x: number): (y: number) => number => (y) => pipe(y, div(x), mult(100));


export const node = <T extends keyof HTMLElementTagNameMap>(n: T): HTMLElementTagNameMap[T] => document.createElement(n);

export const appendTo = <T extends HTMLElement, K extends HTMLElement>(p: T): (c: K) => K => (c) => {
  p.appendChild(c);

  return (c);
};

export const addClassList = <T extends HTMLElement>(xs: string[]): (n: T) => T => (n) => {
  n.classList.add(...xs);

  return (n);
};

export const removeClassList = <T extends HTMLElement>(xs: string[]): (n: T) => T => (n) => {
  n.classList.remove(...xs);

  return (n);
};

export const setInlineStyle = <T extends HTMLElement>(x: string): (n: T) => T => (n) => {
  n.style.cssText = x;

  return (n);
};

export const setInnerText = <T extends HTMLElement>(x: string): (n: T) => T => (n) => {
  n.innerText = x;

  return (n);
};

export const offsetWidth = (n: HTMLElement): number => n.offsetWidth;

export const offsetHeight = (n: HTMLElement): number => n.offsetHeight;