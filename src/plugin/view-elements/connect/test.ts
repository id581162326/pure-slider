import Test from 'test/interface';

import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'helpers/index';

import Connect from 'view-elements/connect';
import Namespace from 'view-elements/connect/namespace';

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init connect',
  run: (props) => {
    const connect = new Connect(props);

    pipe([
      'pure-slider__connect',
      `pure-slider__connect_orientation_${props.orientation}`,
      ...(props.bemBlockClassName ? [
        `${props.bemBlockClassName}__connect`,
        `${props.bemBlockClassName}__connect_orientation_${props.orientation}`
      ] : [])
    ], A.map((x) => expect(connect.node).toHaveClass(x)));
  },
  map: [
    {orientation: 'horizontal'},
    {orientation: 'vertical'},
    {orientation: 'horizontal', bemBlockClassName: 'slider'},
    {orientation: 'vertical', bemBlockClassName: 'slider'}
  ]
};

export const moveTest: Test<[Namespace.Props['orientation'], [pos: number, size: number][]]> = {
  title: 'moveTo method',
  description: 'should move and resize connect',
  run: ([orientation, moveMap]) => {
    const connect = new Connect({orientation});

    pipe(moveMap, A.map(([pos, size]) => {
      connect.moveTo(pos);
      connect.sizeTo(size);

      pipe(orientation, H.switchCases([
        ['horizontal', () => expect(connect.node.style.cssText).toEqual(`left: ${pos}%; max-width: ${size}%;`)],
        ['vertical', () => expect(connect.node.style.cssText).toEqual(`bottom: ${pos}%; max-height: ${size}%;`)],
      ], F.constVoid));
    }));
  },
  map: [
    ['horizontal', [[1, 10], [12, 14]]],
    ['vertical', [[30, 0], [50, 50]]]
  ]
};