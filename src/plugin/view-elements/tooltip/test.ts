import Test from 'test/interface';

import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';

import Tooltip from 'view-elements/tooltip/index';
import Namespace from 'view-elements/tooltip/namespace';

export const initTest: Test<Namespace.Props> = {
  title: 'Init',
  description: 'should init tooltip',
  run: (props) => {
    const tooltip = new Tooltip(props);

    pipe([
      'pure-slider__tooltip',
      `pure-slider__tooltip_orientation_${props.orientation}`,
      ...(props.bemBlockClassName ? [
        `${props.bemBlockClassName}__tooltip`,
        `${props.bemBlockClassName}__tooltip_orientation_${props.orientation}`
      ] : []),
      ...(props.alwaysShown ? ['pure-slider__tooltip_shown'] : [])
    ], A.map((x) => expect(tooltip.node).toHaveClass(x)));
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
    const tooltip = new Tooltip({orientation: 'horizontal', alwaysShown: false});

    tooltip.setValue(value);

    expect(tooltip.node.innerText).toEqual(`${value}`);
  },
  map: [1, 2, 3, 5, 100]
};