import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Unit from '../../unit';

import Scale from '../index';

import Namespace from './namespace.test';
import * as D from './data.test';

const getSubjects: Namespace.GetSubjects = ({orientation, type}) => {
  const container = pipe(H.node('div'), H.setInlineStyle('width: 100px; height: 100px'));

  const scale = Scale.of({
    container, orientation, type,
    bemBlockClassName: {
      base: 'pure-slider',
      theme: '-slider'
    },
    range: [0, 100],
    step: 1,
    onClick: H.trace,
    withValue: false,
    showValueEach: 100
  });

  const node = scale.getNode() as HTMLDivElement;

  const units = scale.getUnits();

  return ({node, scale, units});
};

describe('Scale', () => {
  describe('Method of', () => {
    A.map((orientation: Namespace.Orientation) => {
      it(`should init scale with ${orientation} orientation`, () => {
        const {scale, node} = getSubjects({orientation, type: 'single'});

        expect(scale).toBeInstanceOf(Scale);
        expect(node).toHaveClass('pure-slider__scale');
        expect(node).toHaveClass('-slider__scale');
        expect(node).toHaveClass(`pure-slider__scale_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__scale_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);
  });

  describe('Method getUnits', () => {
    it('should get units', () => {
      const {units} = getSubjects({orientation: 'horizontal', type: 'single'});

      A.map((unit: Namespace.Unit) => expect(unit instanceof Unit).toBeTrue())(units);
    });
  });

  describe('Method moveTo', () => {
    it('should move scale', () => {
      A.map(({type, test}: ArrayElement<Namespace.MoveMap>) => {
        const {scale, units} = getSubjects({orientation: 'horizontal', type});

        A.map((currents: ArrayElement<ArrayElement<Namespace.MoveMap>['test']>) => {
          scale.moveTo(currents);

          const start = NEA.head(currents);
          const end = NEA.last(currents);

          A.map((unit: Namespace.Unit) => {
            const node = unit.getNode();
            const value = unit.getValue();

            const cond = type === 'from-start'
              ? value <= start : type === 'to-end'
                ? value >= end : type === 'inner-range'
                  ? value <= end || value >= start : type === 'outer-range'
                    ? value >= end || value <= start : value === end || value === start;

            if (H.containsClass('pure-slider__unit_active')(node)) {
              expect(cond).toBeTrue();
            }
          })(units);
        })(test);
      })(D.moveMap);
    });
  });
});