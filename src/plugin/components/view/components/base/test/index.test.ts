import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Base from '../index';

import Namespace from './namespace';
import * as D from './data.test';

const container = pipe(H.node('div'), H.setInlineStyle('width: 100px; height: 100px'));

const getSubjects: Namespace.GetSubjects = (orientation) => {
  const base = Base.of({
    orientation,
    container,
    onClick: H.trace,
    range: [0, 100],
    bemBlockClassName: {
      base: 'pure-slider',
      theme: '-slider'
    }
  });

  const node = base.getNode() as HTMLDivElement;

  pipe(document, H.querySelector('body'), O.some, O.map((body) => {
    if (O.isSome(body)) {
      pipe(body, H.prop('value'), H.setInlineStyle('margin: 0;'), H.appendTo)(container);
    }
  }));

  return ({base, node});
};

describe('Base', () => {
  describe('Method of', () => {
    A.map((orientation: Namespace.Orientation) => {
      const {node, base} = getSubjects(orientation);

      it(`should init base with ${orientation} orientation`, () => {
        expect(base instanceof Base).toEqual(true);
        expect(node).toHaveClass('pure-slider__base');
        expect(node).toHaveClass('-slider__base');
        expect(node).toHaveClass(`pure-slider__base_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__base_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);
  });

  describe('On click', () => {
    A.map((orientation: Namespace.Orientation) => {
      const {node} = getSubjects(orientation);

      it('should return click coordinate', () => {
        spyOn(console, 'log');

        A.map(({clientX, clientY, expected}: ArrayElement<Namespace.ClickMap>) => {
          node.dispatchEvent(new MouseEvent('click', {clientX, clientY, bubbles: true}));

          expect(console.log).toHaveBeenCalledWith(expected);
        })(D.clickMap);
      });
    })(['horizontal', 'vertical']);
  });
});