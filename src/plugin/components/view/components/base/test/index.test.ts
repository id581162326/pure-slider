import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Base from '../index';
import Namespace from '../namespace';

describe('Base element', () => {
  const container = pipe(H.node('div'), H.setInlineStyle('width: 100px, height: 100px;'));

  describe('Method of', () => {
    A.map((orientation: Namespace.Props['orientation']) => {
      it(`should init element with ${orientation} orientation`, () => {
        const base = Base.of({
          container,
          orientation,
          onClick: () => {},
          range: [0, 100],
          bemBlockClassName: {
            base: 'pure-slider',
            theme: '-slider'
          }
        });

        const node = base.getNode();

        expect(node).toHaveClass('pure-slider__base');
        expect(node).toHaveClass('-slider__base');
        expect(node).toHaveClass(`pure-slider__base_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__base_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);
  });
});