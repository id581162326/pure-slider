import Test from 'test/interface';

import {pipe} from 'fp-ts/function';
import * as H from 'helpers';

import Tooltip from 'view-components/tooltip';
import Namespace from 'view-components/tooltip/namespace';

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init tooltip',
  run: (props) => {
    const tooltip = pipe(Tooltip, H.instantiateWith(props));
    const node = tooltip.node;

    expect(node).toHaveClass('pure-slider__tooltip');
    expect(node).toHaveClass(`pure-slider__tooltip_orientation_${props.orientation}`);

    if (props.bemBlockClassName) {
      expect(node).toHaveClass(`${props.bemBlockClassName}__tooltip`);
      expect(node).toHaveClass(`${props.bemBlockClassName}__tooltip_orientation_${props.orientation}`);
    } else {
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__tooltip`);
      expect(node).not.toHaveClass(`${props.bemBlockClassName}__tooltip_orientation_${props.orientation}`);
    }

    if (props.alwaysShown) {
      expect(node).toHaveClass('pure-slider__tooltip_shown');
    } else {
      expect(node).not.toHaveClass('pure-slider__tooltip_shown');
    }
  },
  map: [
    {orientation: 'horizontal', alwaysShown: false},
    {orientation: 'vertical', alwaysShown: false},
    {orientation: 'horizontal', alwaysShown: true},
    {orientation: 'horizontal', alwaysShown: false, bemBlockClassName: 'slider'},
    {orientation: 'vertical', alwaysShown: false, bemBlockClassName: 'slider'}
  ]
};

export const setValueTest: Test<number> = {
  title: 'setValue method',
  description: 'should set tooltip\'s value',
  run: (value) => {
    const tooltip = pipe(Tooltip, H.instantiateWith({orientation: 'horizontal', alwaysShown: false}));

    tooltip.setValue(value);

    expect(tooltip.node.innerText).toEqual(`${value}`);
  },
  map: [1, 2, 3, 5, 100]
};