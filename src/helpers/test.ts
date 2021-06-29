import isSpy = jasmine.isSpy;
import Test from 'test/interface';

import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as H from 'helpers/index';

export const traceTest: Test<any> = {
  title: 'trace',
  description: 'should log value to console and return it',
  run: (x) => {
    if (!isSpy(console.log)) {
      spyOn(console, 'log');
    }

    const y = H.trace(x);

    expect(console.log).toHaveBeenCalledWith(x);
    expect(y).toEqual(x);
  },
  map: [1, '1', undefined, null]
};

export const toStringTest: Test<any> = {
  title: 'toString',
  description: 'should convert value to string and return it',
  run: (x) => {
    expect(H.toString(x)).toEqual(`${x}`);
  },
  map: [1, '1', undefined, null]
};

export const propTest: Test<{ prop1: any, prop2: any }> = {
  title: 'prop',
  description: 'should return prop of object',
  run: (x) => {
    expect(pipe(x, H.prop('prop1'))).toEqual(x.prop1);
    expect(pipe(x, H.prop('prop2'))).toEqual(x.prop2);
  },
  map: [
    {prop1: 'someProp1', prop2: 'someProp2'},
    {prop1: 1, prop2: 2}
  ]
};

export const identTest: Test<unknown> = {
  title: 'ident',
  description: 'should return value',
  run: (x) => {
    expect(H.ident(x)).toEqual(x);
  },
  map: [1, '1', undefined, null]
};

export const callWithTest: Test<unknown[]> = {
  title: 'callWith',
  description: 'should call function',
  run: (x) => {
    const foo = {bar: function (..._: unknown[]) {}};

    spyOn(foo, 'bar');

    H.callWith<typeof foo.bar>(...x)(foo.bar);

    expect(foo.bar).toHaveBeenCalledWith(...x);
  },
  map: [
    [], [1], [1, 2],
    [1, '2', undefined]
  ]
};

export const instantiateTest: Test<unknown[]> = {
  title: 'instantiate',
  description: 'should instantiate class',
  run: (x) => {
    class Foo {
      constructor(..._: unknown[]) {}
    }

    const foo = H.instantiateWith<typeof Foo>(...x)(Foo);

    expect(foo).toBeInstanceOf(Foo);
  },
  map: [
    [], [1], [1, 2],
    [1, '2', undefined]
  ]
};

export const switchCasesTest: Test<string> = {
  title: 'switchCases',
  description: 'should to match the tag to a cases and get last matching',
  run: (x) => {
    const firstSwitch = H.switchCases([['foo', F.constant(1)], ['foo', F.constant(2)], ['baz', F.constant(3)]], F.constant(NaN));
    const secondSwitch = H.switchCases([['foo', F.constant(1)], ['bar', F.constant(2)], ['foo', F.constant(3)]], F.constant(NaN));
    const thirdSwitch = H.switchCases([['fizz', F.constant(1)], ['fizz', F.constant(2)], ['fizz', F.constant(3)]], F.constant(NaN));
    const fourthSwitch = H.switchCases([['foo', F.constant(1)], ['fizz', F.constant(2)], ['fizz', F.constant(3)]], F.constant(NaN));

    expect(firstSwitch(x)).toEqual(2);
    expect(secondSwitch(x)).toEqual(3);
    expect(thirdSwitch(x)).toBeNaN();
    expect(fourthSwitch(x)).toEqual(1);
  },
  map: ['foo']
};

export const subTest: Test<[number, number]> = {
  title: 'sub',
  description: 'should subtract first argument from second',
  run: ([x, y]) => {
    expect(H.sub(x)(y)).toEqual(y - x);
    expect(H.sub(y)(x)).toEqual(x - y);
  },
  map: [
    [Math.random(), Math.random()],
    [Math.random(), Math.random()]
  ]
};

export const addTest: Test<[number, number]> = {
  title: 'add',
  description: 'should add first argument to second',
  run: ([x, y]) => {
    expect(H.add(x)(y)).toEqual(y + x);
    expect(H.add(y)(x)).toEqual(x + y);
  },
  map: [
    [Math.random(), Math.random()],
    [Math.random(), Math.random()]
  ]
};

export const decTest: Test<number> = {
  title: 'dec',
  description: 'should decrease value',
  run: (x) => {
    expect(H.dec(x)).toEqual(x - 1);
  },
  map: [Math.random(), Math.random()]
};

export const incTest: Test<number> = {
  title: 'dec',
  description: 'should increase value',
  run: (x) => {
    expect(H.inc(x)).toEqual(x + 1);
  },
  map: [Math.random(), Math.random()]
};

export const divTest: Test<[number, number]> = {
  title: 'div',
  description: 'should divide second argument by first',
  run: ([x, y]) => {
    expect(H.div(x)(y)).toEqual(y / x);
    expect(H.div(y)(x)).toEqual(x / y);
  },
  map: [
    [Math.random(), Math.random()],
    [Math.random(), Math.random()]
  ]
};

export const multTest: Test<[number, number]> = {
  title: 'mult',
  description: 'should multiply second argument by first',
  run: ([x, y]) => {
    expect(H.mult(x)(y)).toEqual(y * x);
    expect(H.mult(y)(x)).toEqual(x * y);
  },
  map: [
    [Math.random(), Math.random()],
    [Math.random(), Math.random()]
  ]
};

export const halfTest: Test<number> = {
  title: 'half',
  description: 'should halve value',
  run: (x) => {
    expect(H.half(x)).toEqual(x / 2);
  },
  map: [
    Math.random(),
    Math.random()
  ]
};

export const negate: Test<number> = {
  title: 'negate',
  description: 'should negate value',
  run: (x) => {
    expect(H.negate(x)).toEqual(-x);
  },
  map: [1, -1, 0, -3, 5]
};

export const percentageTest: Test<[number, number]> = {
  title: 'half',
  description: 'should get percentage of first argument from second',
  run: ([x, y]) => {
    expect(H.percentage(x)(y)).toEqual(y / x * 100);
    expect(H.percentage(y)(x)).toEqual(x / y * 100);
  },
  map: [
    [Math.random(), Math.random()],
    [Math.random(), Math.random()]
  ]
};

export const remainderTest: Test<[number, number]> = {
  title: 'remainder',
  description: 'should get remainder left over when one argument is divided by second',
  run: ([x, y]) => {
    expect(H.remainder(x)(y)).toEqual(y % x);
    expect(H.remainder(y)(x)).toEqual(x % y);
  },
  map: [
    [Math.random(), Math.random()],
    [Math.random(), Math.random()]
  ]
};

export const eqTest: Test<[unknown, unknown]> = {
  title: 'eq',
  description: 'should check values equality',
  run: ([x, y]) => {
    expect(H.eq(x)(y)).toEqual(x === y);
  },
  map: [[1, 1], [1, 2]]
};

export const notTest: Test<boolean> = {
  title: 'not',
  description: 'should negate boolean value',
  run: (x) => {
    expect(H.not(x)).toEqual(!x);
  },
  map: [true, false]
}

export const nthOrNoneTest: Test<[number, unknown, unknown[]]> = {
  title: 'nthOrNone',
  description: 'should get nth element of array or none value, if it doesn\'t exist',
  run: ([nth, none, array]) => {
    expect(H.nthOrNone(nth, none)(array)).toEqual(array[nth] ? array[nth] : none);
  },
  map: [
    [0, 0, [1, 2, 3]],
    [2, 1, [1, 2, 3]],
    [10, 0, [1, 2, 3]],
    [10, 'none', ['1', '2', '3']]
  ]
};

export const subAdjacentTest: Test<[number, number[]]> = {
  title: 'subAdjacent',
  description: 'should subtract prev element from current',
  run: ([nth, array]) => {
    expect(H.subAdjacent(nth)(array)).toEqual(array[nth] && array[nth - 1] ? array[nth] - array[nth - 1] : NaN);
  },
  map: [
    [0, [1, 2, 3]],
    [2, [1, 2, 3]],
    [10, [1, 2, 3]],
  ]
};

export const nodeTest: Test<keyof HTMLElementTagNameMap> = {
  title: 'node',
  description: 'should create node and return it',
  run: (x) => {
    const node = H.node(x);

    expect(node.nodeName).toEqual(x.toUpperCase());
  },
  map: ['div', 'span', 'label']
};

export const appendToTest: Test<HTMLElement> = {
  title: 'appendTo',
  description: 'should append node to parent and return it',
  run: (x) => {
    const span = pipe(H.node('span'), H.appendTo(x));

    expect(span.parentElement).toEqual(x);
  },
  map: [H.node('div'), H.node('div')]
};

export const addClassListTest: Test<string[]> = {
  title: 'addClassList',
  description: 'should add class list to node  and return it',
  run: (x) => {
    const span = pipe(H.node('span'), H.addClassList(x));

    A.map((y: string) => expect(span).toHaveClass(y))(x);
  },
  map: [
    ['foo'], ['bar'], ['fuzz'],
    ['foo', 'bar', 'fuzz']
  ]
};

export const removeClassListTest: Test<string[]> = {
  title: 'addClassList',
  description: 'should add class list to node  and return it',
  run: (x) => {
    const span = pipe(H.node('span'), H.addClassList(x), H.removeClassList(x));

    A.map((y: string) => expect(span).not.toHaveClass(y))(x);
  },
  map: [
    ['foo'], ['bar'], ['fuzz'],
    ['foo', 'bar', 'fuzz']
  ]
};

export const setInlineStyleTest: Test<[keyof CSSStyleDeclaration, string]> = {
  title: 'setInlineStyle',
  description: 'should set inline style to node and return it',
  run: ([key, value]) => {
    const span = pipe(H.node('span'), H.setInlineStyle(`${key}:${value}`));

    expect(span.style[key]).toEqual(value);
  },
  map: [
    ['width', '10px'],
    ['width', '15px'],
    ['height', '0px'],
    ['color', 'rgb(255, 255, 255)']
  ]
};

export const setInnerTextTest: Test<string> = {
  title: 'setInlineStyle',
  description: 'should set inline style to node and return it',
  run: (x) => {
    const span = pipe(H.node('span'), H.setInnerText(x));

    expect(span.innerText).toEqual(x);
  },
  map: ['foo', 'bar', 'baz']
};

export const addEventListenerTest: Test<keyof HTMLElementEventMap> = {
  title: 'addEventListener',
  description: 'should add event listener to node and return it',
  run: (x) => {
    const foo = {x: (_: string) => {}};

    spyOn(foo, 'x');

    const div = pipe(H.node('div'), H.addEventListener(x, (e) => foo.x(e.type)));

    div.dispatchEvent(new Event(x));

    expect(foo.x).toHaveBeenCalledWith(x);
  },
  map: ['click', 'drag', 'touchmove']
};

export const removeEventListenerTest: Test<keyof HTMLElementEventMap> = {
  title: 'addEventListener',
  description: 'should remove event listener from node and return it',
  run: (x) => {
    const foo = {x: (_: string) => {}};

    spyOn(foo, 'x');

    const listener = (e: Event) => foo.x(e.type);

    const div = pipe(H.node('div'), H.addEventListener(x, listener), H.removeEventListener(x, listener));

    div.dispatchEvent(new Event(x));

    expect(foo.x).not.toHaveBeenCalledWith(x);
  },
  map: ['click', 'drag', 'touchmove']
};

export const querySelectorTest: Test<string | 'span' | 'div'> = {
  title: 'querySelector',
  description: 'should get option of node by selector',
  run: (x) => {
    const parent = H.node('div');

    pipe(H.node('span'), H.appendTo(parent), H.addClassList(x === 'span' || x === 'div' ? [] : [x]));

    const foundNode = pipe(parent, H.querySelector(x === 'span' || x === 'div' ? x : `.${x}`));

    if (O.isSome(foundNode)) {
      expect(pipe(foundNode, H.prop('value'), H.prop('parentElement'))).toEqual(parent);
    } else {
      expect(foundNode._tag).toEqual('None');
    }
  },
  map: ['js-foo', 'js-bar', 'js-baz', 'span', 'div']
};

export const querySelectorAllTest: Test<string | 'span' | 'div'> = {
  title: 'querySelectorAll',
  description: 'should get array of nodes by selector',
  run: (x) => {
    const parent = H.node('div');

    A.map(flow(H.addClassList(x === 'span' || x === 'div' ? [] : [x]), H.appendTo(parent)))([
      H.node('div'),
      H.node('span'),
      H.node('div')
    ]);

    const foundNodes = H.querySelectorAll(x === 'div' || x === 'span' ? x : `.${x}`)(parent);

    expect(A.size(foundNodes)).toEqual(x === 'div' ? 2 : x === 'span' ? 1 : 3);

    A.map((x: Element) => expect(x.parentElement).toEqual(parent))(foundNodes);
  },
  map: ['js-foo', 'js-bar', 'js-baz', 'span', 'div']
};

