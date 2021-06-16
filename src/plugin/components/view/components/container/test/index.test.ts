import * as A from 'fp-ts/Array';

import * as H from '../../../../../../helpers';

import Namespace from '../namespace';
import Container from '../index';

describe('Container', () => {
  describe('Method of', () => {
    A.map((orientation: Namespace.Props['orientation']) => {
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

      it(`should init element with ${orientation} orientation`, () => {
        expect(node).toHaveClass('pure-slider');
        expect(node).toHaveClass('-slider');
        expect(node).toHaveClass(`pure-slider_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);
  });
});