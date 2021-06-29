import Test from 'test/interface';

import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'helpers';

import Connect from 'view-components/connect';
import Namespace from 'view-components/connect/namespace';

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init connect',
  run: (props) => {
    const connect = pipe(Connect, H.instantiateWith(props));
    const node = connect.node;

    expect(node).toHaveClass('pure-slider__connect');
    expect(node).toHaveClass(`pure-slider__connect_orientation_${props.orientation}`);

    if (props.bemBlockClassName) {
      expect(node).toHaveClass(`${props.bemBlockClassName}__connect`);
      expect(node).toHaveClass(`${props.bemBlockClassName}__connect_orientation_${props.orientation}`);
    } else {
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__connect`);
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__connect_orientation_${props.orientation}`);
    }
  },
  map: [
    {orientation: 'horizontal'},
    {orientation: 'vertical'},
    {orientation: 'horizontal', bemBlockClassName: 'slider'},
    {bemBlockClassName: 'slider', orientation: 'vertical'}
  ]
};

export const moveTest: Test<Namespace.Props['orientation']> = {
  title: 'moveTo method',
  description: 'should move and resize connect',
  run: (orientation) => {
    const connect = pipe(Connect, H.instantiateWith({orientation}));
    const node = connect.node;

    const moveMap: [number, number][] = [[1, 10], [12, 14], [30, 0], [50, 50]];

    pipe(moveMap, A.map(([pos, size]) => {
      connect.moveTo(pos, size);

      pipe(orientation, H.switchCases([
        ['horizontal', () => expect(node.style.cssText).toEqual(`left: ${pos}%; max-width: ${size}%;`)],
        ['vertical', () => expect(node.style.cssText).toEqual(`bottom: ${pos}%; max-height: ${size}%;`)],
      ], F.constVoid))
    }))
  },
  map: ['horizontal', 'vertical']
}