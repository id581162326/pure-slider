import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {flow, pipe} from 'fp-ts/function';

import * as H from '../index';

describe('Helpers', () => {
  describe('Debug functions', () => {
    describe('trace', () => {
      it('should log and return value', () => {
        spyOn(console, 'log');

        const test = H.trace('test');

        expect(console.log).toHaveBeenCalledOnceWith(test);
      });
    });
  });

  describe('Misc functions', () => {
    describe('toString', () => {
      it('should convert number to string', () => {
        expect(H.toString(1)).toEqual('1');
      });
    });

    describe('prop', () => {
      it('should get prop from object', () => {
        const object: { prop: string } = {
          prop: 'prop value'
        };

        expect(pipe(object, H.prop('prop'))).toEqual(object.prop);
      });
    });

    describe('ident', () => {
      it('should return argument', () => {
        expect(H.ident('ident')).toEqual('ident');
      });
    });

    describe('call', () => {
      it('should call function with one argument', () => {
        spyOn(console, 'log');

        pipe(console.log, H.call(['console.log function just called']));

        expect(console.log).toHaveBeenCalledOnceWith('console.log function just called');
      });

      it('should call function with arbitrary number of arguments', () => {
        spyOn(console, 'log');

        pipe(console.log, H.call([1, 2, 3, 4, 5]));

        expect(console.log).toHaveBeenCalledOnceWith(1, 2, 3, 4, 5);
      });
    });
  });

  describe('Math functions', () => {
    const x = flow(Math.random, (x) => x * 100, Math.round)();

    const y = flow(Math.random, (y) => y * 100, Math.round)();

    describe('sub', () => {
      it('should subtract two values', () => {
        expect(H.sub(x)(y)).toEqual(y - x);

        expect(H.sub(y)(x)).toEqual(x - y);
      });
    });

    describe('add', () => {
      it('should add two values', () => {
        expect(H.add(x)(y)).toEqual(x + y);

        expect(H.add(y)(x)).toEqual(y + x);
      });
    });

    describe('dec', () => {
      it('should decrease value', () => {
        expect(H.dec(x)).toEqual(x - 1);

        expect(H.dec(y)).toEqual(y - 1);
      });
    });

    describe('inc', () => {
      it('should increase value', () => {
        expect(H.inc(x)).toEqual(x + 1);

        expect(H.inc(y)).toEqual(y + 1);
      });
    });

    describe('div', () => {
      it('should divide two values', () => {
        expect(H.div(x)(y)).toEqual(y / x);

        expect(H.div(y)(x)).toEqual(x / y);
      });
    });

    describe('mult', () => {
      it('should mult two values', () => {
        expect(H.mult(x)(y)).toEqual(y * x);

        expect(H.mult(y)(x)).toEqual(x * y);
      });
    });

    describe('half', () => {
      it('should halve value', () => {
        expect(H.half(x)).toEqual(x / 2);

        expect(H.half(y)).toEqual(y / 2);
      });
    });

    describe('negate', () => {
      it('should negate value', () => {
        expect(H.negate(x)).toEqual(x * -1);

        expect(H.negate(y)).toEqual(y * -1);
      });
    });

    describe('percent', () => {
      it('should find percent', () => {
        expect(H.percent(x)(y)).toEqual(y / x * 100);

        expect(H.percent(y)(x)).toEqual(x / y * 100);
      });
    });

    describe('decimal', () => {
      it('should return decimal', () => {
        expect(H.decimal(x)(y)).toEqual(Math.ceil(y % x));

        expect(H.decimal(y)(x)).toEqual(Math.ceil(x % y));
      });
    });
  });

  describe('Array functions', () => {
    const arr1 = [1, 2, 3, 4, 5];

    const arr2 = ['1', '2', '3', '4', '5'];

    const idx = flow(Math.random, H.mult(10), Math.ceil)();

    describe('nthOrNone', () => {
      it('should return nth element', () => {
        expect(H.nthOrNone(idx, NaN)(arr1)).toEqual(arr1[idx] ? arr1[idx] : NaN);

        expect(H.nthOrNone(idx, 'none')(arr2)).toEqual(arr2[idx] ? arr2[idx] : 'none');
      });
    });

    describe('subAdjacent', () => {
      it('should return subtract between two adjacent values', () => {
        expect(H.subAdjacent(idx)(arr1)).toEqual(arr1[idx] && arr1[H.dec(idx)] ? arr1[idx] - arr1[H.dec(idx)] : NaN);
      });
    });
  });

  describe('DOM functions', () => {
    describe('node', () => {
      it('should create and return node', () => {
        const divNode = H.node('div');

        const spanNode = H.node('span');

        expect(divNode.tagName).toEqual('DIV');

        expect(spanNode.tagName).toEqual('SPAN');
      });
    });

    describe('appendTo', () => {
      it('should append and return node', () => {
        const childNode = H.node('div');

        const parentNode = H.node('div');

        const appendedChildNode = H.appendTo(parentNode)(childNode);

        expect(appendedChildNode).toEqual(childNode);

        expect(appendedChildNode.parentNode).toEqual(parentNode);
      });
    });

    describe('appendChildListTo', () => {
      it('should append list of child', () => {
        const parentNode = H.node('div');

        const childNodes = [H.node('div'), H.node('div'), H.node('div')];

        H.appendChildListTo(parentNode)(childNodes);

        A.map((node: HTMLElement) => expect(node.parentNode).toEqual(parentNode))(childNodes);
      });
    });

    describe('addClassList', () => {
      it('should add list of classes to node and return it', () => {
        const node = H.node('div');

        const classList = ['foo', 'bar', 'bizz', 'fizz'];

        const nodeWithClasses = H.addClassList(classList)(node);

        A.map((className: string) => expect(node).toHaveClass(className))(classList);

        expect(nodeWithClasses).toEqual(node);
      });
    });

    describe('removeClassList', () => {
      it('should remove list of classes from node and return it', () => {
        const node = H.node('div');

        const classList = ['foo', 'bar', 'bizz', 'fizz'];

        const classListFiltered = ['bizz', 'fizz'];

        const classListToRemove = ['foo', 'bar'];

        const nodeWithClasses = H.addClassList(classList)(node);

        const nodeWithoutClasses = H.removeClassList(classListToRemove)(nodeWithClasses);

        A.map((className: string) => expect(nodeWithClasses).toHaveClass(className))(classListFiltered);

        A.map((className: string) => expect(nodeWithClasses).not.toHaveClass(className))(classListToRemove);

        expect(nodeWithoutClasses).toEqual(nodeWithClasses);
      });
    });

    describe('containsClass', () => {
      it('should check for class presence', () => {
        const node = H.node('div');

        const classList = ['foo', 'bar'];

        H.addClassList(classList)(node);

        expect(H.containsClass('foo')(node)).toEqual(true);

        expect(H.containsClass('bar')(node)).toEqual(true);

        expect(H.containsClass('fizz')(node)).toEqual(false);
      });
    });

    describe('setInlineStyles', () => {
      it('should set inline styles to node and return it', () => {
        const node = H.node('div');

        const inlineStyle = 'display: grid;';

        const nodeWithInlineStyles = H.setInlineStyle(inlineStyle)(node);

        expect(nodeWithInlineStyles.style.cssText).toEqual(inlineStyle);

        expect(nodeWithInlineStyles).toEqual(node);
      });
    });

    describe('setInnerText', () => {
      it('should set inner text and return node', () => {
        const node = H.node('div');

        const innerText = 'foo';

        const nodeWithText = H.setInnerText(innerText)(node);

        expect(nodeWithText.innerText).toEqual(innerText);

        expect(nodeWithText).toEqual(node);
      });
    });

    describe('addEventListener', () => {
      it('should add event listener to node and return it', () => {
        spyOn(console, 'log');

        const node = H.node('div');

        const listener = () => H.trace(11);

        const nodeWithListener = H.addEventListener('click', listener)(node) as HTMLElement;

        nodeWithListener.click();

        expect(nodeWithListener).toEqual(node);

        expect(console.log).toHaveBeenCalledWith(11);
      });
    });

    describe('removeEventListener', () => {
      it('should remove event listener from node and return it', () => {
        spyOn(console, 'log');

        const node = H.node('div');

        const listener = () => H.trace(11);

        const nodeWithListener = H.addEventListener('click', listener)(node);

        const nodeWithoutListener = H.removeEventListener('click', listener)(nodeWithListener) as HTMLElement;

        nodeWithoutListener.click();

        expect(nodeWithoutListener).toEqual(node);

        expect(console.log).not.toHaveBeenCalledWith(11);
      });
    });

    describe('querySelector', () => {
      it('should find node by selector and return option of it', () => {
        const node = H.node('div');

        const parentNode = H.node('div');

        pipe(node, H.appendTo(parentNode), H.addClassList(['selector']));

        pipe(parentNode, H.querySelector('.selector'), O.some, O.map((x) => O.isSome(x)
          ? expect(x.value).toEqual(node) : expect().nothing()));
      });
    });

    describe('querySelectorAll', () => {
      it('should find all nodes by selector and return them', () => {
        const firstNode = H.node('div');

        const secondNode = H.node('div');

        const parentNode = H.node('div');

        pipe([firstNode, secondNode], A.map(H.addClassList(['selector'])), H.appendChildListTo(parentNode));

        const nodes = H.querySelectorAll('.selector')(parentNode);

        expect(A.size(nodes)).toEqual(2);

        expect(nodes).toEqual([firstNode, secondNode]);
      });
    });


  });
});