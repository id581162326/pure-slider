import Test from 'test/interface';

import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';

import Base from 'view-elements/base/index';
import Namespace from 'view-elements/base/namespace';

const defaultProps: Namespace.Props = {
  orientation: 'horizontal',
  onClick: (_) => {}
};

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init base',
  run: (props) => {
    const base = new Base(props);

    pipe([
      'pure-slider__base',
      `pure-slider__base_orientation_${props.orientation}`,
      ...(props.bemBlockClassName ? [
        `${props.bemBlockClassName}__base`,
        `${props.bemBlockClassName}__base_orientation_${props.orientation}`
      ] : [])
    ], A.map((x) => expect(base.node).toHaveClass(x)));
  },
  map: [
    defaultProps,
    {...defaultProps, orientation: 'vertical'},
    {...defaultProps, bemBlockClassName: 'slider'},
    {...defaultProps, bemBlockClassName: 'slider', orientation: 'vertical'}
  ]
};

export const clickTest: Test<[number, number]> = {
  title: 'onClick callback',
  description: 'should be called with a click coordinates',
  run: ([clientX, clientY]) => {
    const base = new Base(defaultProps);

    if (!jasmine.isSpy(defaultProps.onClick)) {
      spyOn(defaultProps, 'onClick');
    }

    base.node.dispatchEvent(new MouseEvent('click', {clientX, clientY}));

    expect(defaultProps.onClick).toHaveBeenCalledWith({x: clientX, y: clientY});
  },
  map: [[100, 100], [100, 150], [-100, 100], [100, -150]]
};