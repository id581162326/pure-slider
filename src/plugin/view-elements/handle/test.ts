import Test from 'test/interface';

import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'helpers/index';

import Handle from 'view-elements/handle';
import Namespace from 'view-elements/handle/namespace';

const defaultProps: Namespace.Props = {
  orientation: 'horizontal',
  onDrag: (_) => {},
  onIncrease: () => {},
  onDecrease: () => {}
};

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init handle',
  run: (props) => {
    const handle = new Handle(props);

    pipe([
      'pure-slider__handle',
      `pure-slider__handle_orientation_${props.orientation}`,
      ...(props.bemBlockClassName ? [
        `${props.bemBlockClassName}__handle`,
        `${props.bemBlockClassName}__handle_orientation_${props.orientation}`
      ] : [])
    ], A.map((x) => expect(handle.node).toHaveClass(x)));
  },
  map: [
    defaultProps,
    {...defaultProps, orientation: 'vertical'},
    {...defaultProps, bemBlockClassName: 'slider'},
    {...defaultProps, bemBlockClassName: 'slider', orientation: 'vertical'}
  ]
};

export const moveTest: Test<[orientation: Namespace.Props['orientation'], moveMap: number[]]> = {
  title: 'moveTo method',
  description: 'should move handle',
  run: ([orientation, moveMap]) => {
    const handle = new Handle({...defaultProps, orientation});

    pipe(moveMap, A.map((x) => {
      handle.moveTo(x);

      pipe(orientation, H.switchCases([
        ['horizontal', () => expect(handle.node.style.cssText).toEqual(`left: calc(${x}% - ${H.half(handle.node.offsetWidth)}px);`)],
        ['vertical', () => expect(handle.node.style.cssText).toEqual(`bottom: calc(${x}% - ${H.half(handle.node.offsetWidth)}px);`)]
      ], F.constVoid));
    }));
  },
  map: [
    ['horizontal', [1, 2, 4, 10, 20]],
    ['vertical', [30, 50, 60, 100]]
  ]
};

export const dragTest: Test<[clientX: number, clientY: number]> = {
  title: 'onDrag callback',
  description: 'should be called with a drag delta coordinates',
  run: ([clientX, clientY]) => {
    const handle = pipe(Handle, H.instance(defaultProps));

    if (!jasmine.isSpy(defaultProps.onDrag)) {
      spyOn(defaultProps, 'onDrag');
    }

    handle.node.dispatchEvent(new MouseEvent('mousedown', {clientY: 0, clientX: 0}));
    window.dispatchEvent(new MouseEvent('mousemove', {clientX, clientY}));

    expect(defaultProps.onDrag).toHaveBeenCalledWith({x: clientX, y: clientY});
  },
  map: [[100, 100], [100, 150], [-100, 100], [100, -150]]
};

export const decreaseTest: Test<'ArrowDown' | 'ArrowLeft' | 'Minus'> = {
  title: 'onDecrease callback',
  description: 'should be called when decrease keys pressed',
  run: (code) => {
    const handle = new Handle(defaultProps);

    if (!(jasmine.isSpy(defaultProps.onDecrease))) {
      spyOn(defaultProps, 'onDecrease');
    } else {
      defaultProps.onDecrease.calls.reset();
    }

    handle.node.dispatchEvent(new KeyboardEvent('keydown', {code}));

    pipe(code, H.switchCases([
      ['Minus', () => expect(defaultProps.onDecrease).toHaveBeenCalled()],
      ['ArrowDown', () => expect(defaultProps.onDecrease).toHaveBeenCalled()],
      ['ArrowLeft', () => expect(defaultProps.onDecrease).toHaveBeenCalled()]
    ], F.constVoid));
  },
  map: ['Minus', 'ArrowDown', 'ArrowLeft']
};

export const increaseTest: Test<'Equal' | 'ArrowUp' | 'ArrowRight'> = {
  title: 'onIncrease callback',
  description: 'should be called when increase keys pressed',
  run: (code) => {
    const handle = new Handle(defaultProps);

    if (!(jasmine.isSpy(defaultProps.onIncrease))) {
      spyOn(defaultProps, 'onIncrease');
    } else {
      defaultProps.onIncrease.calls.reset();
    }

    handle.node.dispatchEvent(new KeyboardEvent('keydown', {code}));

    pipe(code, H.switchCases([
      ['Equal', () => expect(defaultProps.onIncrease).toHaveBeenCalled()],
      ['ArrowUp', () => expect(defaultProps.onIncrease).toHaveBeenCalled()],
      ['ArrowRight', () => expect(defaultProps.onIncrease).toHaveBeenCalled()]
    ], F.constVoid));
  },
  map: ['Equal', 'ArrowUp', 'ArrowRight']
};