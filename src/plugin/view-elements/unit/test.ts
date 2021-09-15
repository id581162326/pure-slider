import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';

import Unit from 'view-elements/unit/index';
import Namespace from 'view-elements/unit/namespace';

import Test from 'test/interface';

const defaultProps: Namespace.Props = {
  value: 0,
  orientation: 'horizontal',
  showValue: false,
  onClick: (_) => {}
};

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init unit',
  run: (props) => {
    const unit = new Unit(props);

    pipe([
      'pure-slider__unit',
      `pure-slider__unit_orientation_${props.orientation}`,
      ...(props.bemBlockClassName ? [
        `${props.bemBlockClassName}__unit`,
        `${props.bemBlockClassName}__unit_orientation_${props.orientation}`
      ] : [])
    ], A.map((x) => expect(unit.node).toHaveClass(x)));

    if (props.showValue) {
      expect(unit.node.innerHTML).toEqual(`<span class="pure-slider__unit-value${props.bemBlockClassName
        ? ` ${props.bemBlockClassName}__unit-value`
        : ''}">${props.value}</span>`);
    }
  },
  map: [
    defaultProps,
    {...defaultProps, orientation: 'vertical'},
    {...defaultProps, bemBlockClassName: 'slider'},
    {...defaultProps, bemBlockClassName: 'slider', orientation: 'vertical'},
    {...defaultProps, showValue: true},
    {...defaultProps, bemBlockClassName: 'slider', showValue: true}
  ]
};

export const setActiveTest: Test<Namespace.Props> = {
  title: 'setActive method',
  description: 'should set active mode to unit',
  run: (props) => {
    const unit = new Unit(props);

    pipe([
      'pure-slider__unit_active',
      ...(props.bemBlockClassName ? [`${props.bemBlockClassName}__unit_active`] : [])
    ], A.map((x) => {
      unit.setActive(true);
      expect(unit.node).toHaveClass(x);

      unit.setActive(false);
      expect(unit.node).not.toHaveClass(x);
    }));
  },
  map: [
    defaultProps,
    {...defaultProps, bemBlockClassName: 'slider'}
  ]
};