import Test from 'test/interface';

import {pipe} from 'fp-ts/function';
import * as H from 'helpers/index';

import Base from 'view-elements/base/index';
import Namespace from 'view-elements/base/namespace';

const defaultProp: Namespace.Props = {
  orientation: 'horizontal',
  onClick: (_) => {}
};

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init base',
  run: (props) => {
    const base = pipe(Base, H.instance(props));
    const node = base.node;

    expect(node).toHaveClass('pure-slider__base');
    expect(node).toHaveClass(`pure-slider__base_orientation_${props.orientation}`);

    if (props.bemBlockClassName) {
      expect(node).toHaveClass(`${props.bemBlockClassName}__base`);
      expect(node).toHaveClass(`${props.bemBlockClassName}__base_orientation_${props.orientation}`);
    } else {
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__base`);
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__base_orientation_${props.orientation}`);
    }
  },
  map: [
    defaultProp,
    {...defaultProp, orientation: 'vertical'},
    {...defaultProp, bemBlockClassName: 'slider'},
    {...defaultProp, bemBlockClassName: 'slider', orientation: 'vertical'}
  ]
};

export const clickTest: Test<[number, number]> = {
  title: 'onClick callback',
  description: 'should be called with a click coordinates',
  run: ([clientX, clientY]) => {
    const mock = {foo: (_: { x: number, y: number }) => {}};

    spyOn(mock, 'foo');

    const base = pipe(Base, H.instance({...defaultProp, onClick: mock.foo}));
    const node = base.node;

    node.dispatchEvent(new MouseEvent('click', {clientX, clientY}));

    expect(mock.foo).toHaveBeenCalledWith({x: clientX, y: clientY});
  },
  map: [[100, 100], [100, 150], [-100, 100], [100, -150]]
};