import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';
import * as H from 'helpers';

import Unit from 'view-components/unit/index';
import Namespace from 'view-components/unit/namespace';

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
    const unit = pipe(Unit, H.instance(props));
    const node = unit.node;

    expect(node).toHaveClass('pure-slider__unit');
    expect(node).toHaveClass(`pure-slider__unit_orientation_${props.orientation}`);

    if (props.bemBlockClassName) {
      expect(node).toHaveClass(`${props.bemBlockClassName}__unit`);
      expect(node).toHaveClass(`${props.bemBlockClassName}__unit_orientation_${props.orientation}`);
    } else {
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__unit`);
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__unit_orientation_${props.orientation}`);
    }

    if (props.showValue) {
      expect(node.innerHTML).toEqual(`<span class="pure-slider__unit-value${props.bemBlockClassName
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
    const unit = pipe(Unit, H.instance(props));
    const node = unit.node;
    const bemBlockClassName = O.fromNullable(props.bemBlockClassName);

    unit.setActive(true);

    expect(node).toHaveClass('pure-slider__unit_active');
    pipe(bemBlockClassName, O.map((x) => expect(node).toHaveClass(`${x}__unit_active`)));

    unit.setActive(false);

    expect(node).not.toHaveClass('pure-slider__unit_active');
    pipe(bemBlockClassName, O.map((x) => expect(node).not.toHaveClass(`${x}__unit_active`)));
  },
  map: [
    defaultProps,
    {...defaultProps, bemBlockClassName: 'slider'}
  ]
};