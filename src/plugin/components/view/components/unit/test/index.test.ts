import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Unit from '../index';

import Namespace from './namespace.test';
import * as D from './data.test';

const getSubjects: Namespace.GetSubjects = ({value, orientation, withValue}) => {
  const container = pipe(H.node('div'), H.setInlineStyle('width: 100px; height: 100px'));

  const unit = Unit.of({
    container, orientation, withValue, value,
    range: [0, 50],
    bemBlockClassName: {
      base: 'pure-slider',
      theme: '-slider'
    },
    onClick: H.trace
  });

  const node = unit.getNode() as HTMLDivElement;

  return ({node, unit});
};

describe('Unit', () => {
  describe('Method of', () => {
    A.map((orientation: Namespace.Orientation) => {
      const {node, unit} = getSubjects({orientation, withValue: false, value: 1});

      it(`should init unit with ${orientation} orientation`, () => {
        expect(unit).toBeInstanceOf(Unit);
        expect(node).toHaveClass('pure-slider__unit');
        expect(node).toHaveClass('-slider__unit');
        expect(node).toHaveClass(`pure-slider__unit_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__unit_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);

    it('should show value, if withValue prop is true', () => {
      A.map((withValue: boolean) => {
        const {node} = getSubjects({withValue, orientation: 'horizontal', value: 1});

        if (withValue) {
          expect(node.firstElementChild).toBeTruthy();
          expect(Number(node.firstElementChild?.innerHTML)).toEqual(1);
        } else {
          expect(node.firstElementChild).toBeFalsy();
        }
      })([true, false]);
    });
  });

  describe('Method getValue', () => {
    it('should contain value', () => {
      A.map((value: number) => {
        const {unit} = getSubjects({value, orientation: 'horizontal', withValue: false});

        expect(unit.getValue()).toEqual(value);
      })(D.setValueMap);
    });
  });

  describe('Method setActive', () => {
    it('should set active mode', () => {
      const {unit, node} = getSubjects({value: 0, orientation: 'horizontal', withValue: false});

      A.map((active: boolean) => {
        unit.setActive(active);

        if (active) {
          expect(node).toHaveClass('pure-slider__unit_active');
          expect(node).toHaveClass('-slider__unit_active');
        } else {
          expect(node).not.toHaveClass('pure-slider__unit_active');
          expect(node).not.toHaveClass('-slider__unit_active');
        }
      })([true, false]);
    });
  });
});