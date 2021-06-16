import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Tooltip from '../index';

import Namespace from './namespace.test';
import * as D from './data.test';

const getSubjects: Namespace.GetSubjects = ({orientation, alwaysShown}) => {
  const container = pipe(H.node('div'), H.setInlineStyle('width: 100px; height: 100px'));

  const tooltip = Tooltip.of({
    container, orientation, alwaysShown,
    bemBlockClassName: {
      base: 'pure-slider',
      theme: '-slider'
    },
    range: [0, 100],
  });

  const node = tooltip.getNode() as HTMLDivElement;

  return ({node, tooltip});
};


describe('Tooltip', () => {
  describe('Method of', () => {
    A.map(({alwaysShown, orientation}: ArrayElement<Namespace.InitMap>) => {
      const {tooltip, node} = getSubjects({orientation, alwaysShown});

      it(`should init tooltip with ${orientation} orientation`, () => {
        expect(tooltip).toBeInstanceOf(Tooltip);
        expect(node).toHaveClass('pure-slider__tooltip');
        expect(node).toHaveClass('-slider__tooltip');
        expect(node).toHaveClass(`pure-slider__tooltip_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__tooltip_orientation_${orientation}`);
      });

      it('should always show tooltip, if alwaysShown prop is true', () => {
        if (alwaysShown) {
          expect(node).toHaveClass('pure-slider__tooltip_shown');
          expect(node).toHaveClass('-slider__tooltip_shown');
        } else {
          expect(node).not.toHaveClass('pure-slider__tooltip_shown');
          expect(node).not.toHaveClass('-slider__tooltip_shown');
        }
      });
    })(D.initMap);
  });

  describe('Method setValue', () => {
    const {tooltip, node} = getSubjects({orientation: 'horizontal', alwaysShown: false});

    it('should set tooltip\'s value', () => {
      A.map((x: number) => {
        tooltip.setValue(x);

        expect(Number(node.innerText)).toEqual(x);
      })(D.setValueMap);
    })
  })
});