import {pipe} from 'fp-ts/function';

import * as H from '../../../globals/helpers';
import View from '../namespace';


export const move = <T extends View.Connect, K extends HTMLDivElement>({orientation, size, translate}: Partial<T>): (n: K) => K => (n) => {
  switch (orientation) {
    case 'horizontal':
      return H.setInlineStyle(`left: ${translate}%; max-width: ${size}%`)(n) as K;
    case 'vertical':
      return H.setInlineStyle(`top: ${translate}%; max-height: ${size}%`)(n) as K;
    default:
      return (n);
  }
};

export const render = ({orientation, classList = [], size, translate}: Partial<View.Connect>): HTMLDivElement => pipe(
  H.node('div'),
  move({orientation, size, translate}),
  H.addClassList([
    'pure-slider__connect',
    `pure-slider__connect_orientation_${orientation}`,
    ...classList
  ])
);