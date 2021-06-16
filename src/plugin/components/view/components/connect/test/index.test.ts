import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Connect from '../index';

import * as D from './data.test';
import Namespace from './namespace';

const getSubjects: Namespace.GetSubjects = ({type, orientation}) => {
  const container = pipe(H.node('div'), H.setInlineStyle('width: 100px, height: 100px'));

  const connect = Connect.of({
    container,
    orientation,
    type,
    range: [0, 100],
    bemBlockClassName: {
      base: 'pure-slider',
      theme: '-slider'
    }
  });

  const node = connect.getNode() as HTMLDivElement;

  return ({node, connect});
};

describe('Connect', () => {

  describe('Method of', () => {
    A.map((orientation: Namespace.Orientation) => {
      const {node, connect} = getSubjects({type: 'inner', orientation});

      it(`should init connect with ${orientation} orientation`, () => {
        expect(connect instanceof Connect).toEqual(true);
        expect(node).toHaveClass('pure-slider__connect');
        expect(node).toHaveClass('-slider__connect');
        expect(node).toHaveClass(`pure-slider__connect_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__connect_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);
  });

  describe('Method moveTo', () => {
    it('should move connect ', () => {
      A.map((orientation: Namespace.Orientation) => {
        A.map(({type, test}: ArrayElement<Namespace.MoveMap>) => {
          const {connect, node} = getSubjects({orientation, type});

          A.map(({expected, value}: ArrayElement<ArrayElement<Namespace.MoveMap>['test']>) => {
            connect.moveTo(value);

            if (orientation === 'horizontal') {
              const position = node.style.left;

              const size = node.style.maxWidth;

              expect(expected).toEqual({size, position});
            }

            if (orientation === 'vertical') {
              const position = node.style.bottom;

              const size = node.style.maxHeight;

              expect(expected).toEqual({size, position});
            }
          })(test);
        })(D.moveMap);
      })(['horizontal', 'vertical']);
    });
  });
});