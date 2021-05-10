import * as O from 'fp-ts/Option';
import {constant, pipe} from 'fp-ts/function';


export const toStr = (x: number): string => x.toString();

export const prop = <T>(k: keyof T): ((o: T) => T[keyof T]) => (o) => o[k];

export const sub = (x: number): (y: number) => number => (y) => pipe(y, O.fromNullable, O.getOrElse(constant(0))) - x;

export const add = (x: number): (y: number) => number => y => x + pipe(y, O.fromNullable, O.getOrElse(constant(0)));

export const dec = (x: number): number => sub(1)(x);

export const inc = (x: number): number => add(1)(x);

export const div = (x: number): (y: number) => number => (y) => y / x;

export const mult = (x: number): (y: number) => number => (y) => x * y;

export const half = (x: number): number => div(2)(x);

export const percent = (x: number): (y: number) => number => (y) => pipe(y, div(x), mult(100));

export const node = <T extends keyof HTMLElementTagNameMap>(tagName: T): HTMLElementTagNameMap[T] => document.createElement(tagName);

export const appendTo = <T extends HTMLElement, K extends HTMLElement>(p: T): (c: K) => K => (c) => {
  p.appendChild(c);

  return (c);
};

export const addClassList = <T extends string, K extends HTMLElement>(classList: T[]): (n: K) => K => (n) => {
  n.classList.add(...classList);

  return (n);
};

export const removeClassList = <T extends string, K extends HTMLElement>(classList: T[]): (n: K) => K => (n) => {
  n.classList.remove(...classList);

  return (n);
};

export const setInlineStyle = <T extends string, K extends HTMLElement>(style: T): (n: K) => K => (n) => {
  n.style.cssText = style;

  return (n);
};

export const offsetWidth = (n: HTMLElement): number => n.offsetWidth;

export const offsetHeight = (n: HTMLElement): number => n.offsetHeight;