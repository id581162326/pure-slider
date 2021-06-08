import * as A from 'fp-ts/Array';

import * as H from '../../../../../../helpers';

import Connect from '../index';

import * as D from './data.test';
import Namespace from './namespace';
import {pipe} from 'fp-ts/function';

describe('Connect element', () => {
  const container = pipe(H.node('div'), H.setInlineStyle('width: 100px, height: 100px'));

  describe('Method of', () => {
    A.map((orientation: Namespace.Orientation) => {
      it(`should init element with ${orientation} orientation`, () => {
        const connect = Connect.of({
          type: 'inner',
          container,
          orientation,
          range: [0, 100],
          bemBlockClassName: {
            base: 'pure-slider',
            theme: '-slider'
          }
        });

        const node = connect.getNode();

        expect(node).toHaveClass('pure-slider__connect');
        expect(node).toHaveClass('-slider__connect');
        expect(node).toHaveClass(`pure-slider__connect_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__connect_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);
  });

  describe('Method moveTo', () => {
    it('should move connect ', () => {
      const moveMapArray = D.getMoveMapArray(container);

      A.map(({props, test}: Namespace.MoveMap) => {
        const connect = Connect.of(props);

        const node = connect.getNode();

        A.map(({expected, value}: ArrayElement<Namespace.MoveMap['test']>) => {
          connect.moveTo(value);

          if (props.orientation === 'horizontal') {
            const position = node.style.left;

            const size = node.style.maxWidth;

            expect(expected).toEqual({size, position});
          }

          if (props.orientation === 'vertical') {
            const position = node.style.bottom;

            const size = node.style.maxHeight;

            expect(expected).toEqual({size, position});
          }
        })(test)
      })(moveMapArray);
    });
  });
});