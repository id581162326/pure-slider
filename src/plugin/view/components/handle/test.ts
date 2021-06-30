import Test from 'test/interface';

import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'helpers';

import Handle from 'view-components/handle';
import Namespace from 'view-components/handle/namespace';

const defaultProps: Namespace.Props = {
  orientation: 'horizontal',
  onDrag: (_) => {},
  onKeyPress: (_) => {}
};

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init handle',
  run: (props) => {
    const handle = pipe(Handle, H.instantiateWith(props));
    const node = handle.node;

    if (props.bemBlockClassName) {
      expect(node).toHaveClass(`${props.bemBlockClassName}__handle`);
      expect(node).toHaveClass(`${props.bemBlockClassName}__handle_orientation_${props.orientation}`);
    } else {
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__handle`);
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__handle_orientation_${props.orientation}`);
    }
  },
  map: [
    defaultProps,
    {...defaultProps, orientation: 'vertical'},
    {...defaultProps, bemBlockClassName: 'slider'},
    {...defaultProps, bemBlockClassName: 'slider', orientation: 'vertical'}
  ]
};

export const moveTest: Test<Namespace.Props['orientation']> = {
  title: 'moveTo method',
  description: 'should move handle',
  run: (orientation) => {
    const handle = pipe(Handle, H.instantiateWith({...defaultProps, orientation}));
    const node = handle.node;

    const moveMap = [1, 2, 4, 10, 20, 30, 60, 100];

    pipe(moveMap, A.map((x) => {
      handle.moveTo(x);

      pipe(orientation, H.switchCases([
        ['horizontal', () => expect(node.style.cssText).toEqual(`left: calc(${x}% - ${H.half(node.offsetWidth)}px);`)],
        ['vertical', () => expect(node.style.cssText).toEqual(`bottom: calc(${x}% - ${H.half(node.offsetWidth)}px);`)]
      ], F.constVoid));
    }));
  },
  map: ['horizontal', 'vertical']
};

export const dragTest: Test<[number, number]> = {
  title: 'onDrag callback',
  description: 'should be called with a drag delta coordinates',
  run: ([clientX, clientY]) => {
    const foo = {bar: (_: { x: number, y: number }) => {}};

    spyOn(foo, 'bar');

    const handle = pipe(Handle, H.instantiateWith({...defaultProps, onDrag: foo.bar}));

    handle.node.dispatchEvent(new MouseEvent('mousedown', {clientY: 0, clientX: 0}));

    window.dispatchEvent(new MouseEvent('mousemove', {clientX, clientY}));

    expect(foo.bar).toHaveBeenCalledWith({x: clientX, y: clientY});
  },
  map: [[100, 100], [100, 150], [-100, 100], [100, -150]]
};

export const keyPressTest: Test<Namespace.Props['orientation']> = {
  title: 'onKeyPress callback',
  description: 'should be called with a action type',
  run: (orientation) => {
    const foo = {bar: (_: 'inc' | 'dec') => {}};

    const spy = spyOn(foo, 'bar');

    const handle = pipe(Handle, H.instantiateWith({...defaultProps, orientation, onKeyPress: foo.bar}));

    const decCodes = F.tuple('ArrowDown' as 'ArrowDown', 'ArrowLeft' as 'ArrowLeft', 'Minus' as 'Minus');
    const incCodes = F.tuple('ArrowUp' as 'ArrowUp', 'ArrowRight' as 'ArrowRight', 'Equal' as 'Equal');

    pipe(decCodes, A.zip(incCodes), A.map(([decCode, incCode]) => {
      spy.calls.reset();

      handle.node.dispatchEvent(new KeyboardEvent('keydown', {code: decCode}));
      handle.node.dispatchEvent(new KeyboardEvent('keydown', {code: incCode}));

      pipe(true, H.switchCases([
        [decCode === 'Minus', () => expect(foo.bar).toHaveBeenCalledWith('dec')],
        [incCode === 'Equal', () => expect(foo.bar).toHaveBeenCalledWith('dec')],
        [orientation === 'horizontal' && decCode === 'ArrowLeft', () => expect(foo.bar).toHaveBeenCalledWith('dec')],
        [orientation === 'horizontal' && incCode === 'ArrowRight', () => expect(foo.bar).toHaveBeenCalledWith('inc')],
        [orientation === 'vertical' && decCode === 'ArrowDown', () => expect(foo.bar).toHaveBeenCalledWith('dec')],
        [orientation === 'vertical' && incCode === 'ArrowUp', () => expect(foo.bar).toHaveBeenCalledWith('inc')]
      ], F.constVoid));
    }));
  },
  map: ['horizontal', 'vertical']
};