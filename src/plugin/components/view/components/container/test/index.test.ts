import * as A from 'fp-ts/Array';

import * as H from '../../../../../../helpers';

import Namespace from '../namespace';
import Container from '../index';

describe('Container element', () => {
  describe('Method of', () => {
    A.map((orientation: Namespace.Props['orientation']) => {
      it(`should init element with ${orientation} orientation`, () => {
        const connect = Container.of({
          container: H.node('div'),
          orientation,
          range: [0, 100],
          bemBlockClassName: {
            base: 'pure-slider',
            theme: '-slider'
          }
        });

        const node = connect.getNode();

        expect(node).toHaveClass('pure-slider');
        expect(node).toHaveClass('-slider');
        expect(node).toHaveClass(`pure-slider_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);
  });
});