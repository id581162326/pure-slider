import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Handle from '../index';
import Tooltip from '../../tooltip';

import Namespace from './namespace.test';
import * as D from './data.test';
import * as O from 'fp-ts/Option';

const getSubjects: Namespace.GetSubjects = ({orientation, type, showTooltip}) => {
  const container = pipe(H.node('div'), H.setInlineStyle('width: 100px; height: 100px'));

  const handle = Handle.of({
    container,
    orientation,
    type,
    showTooltip,
    tooltipAlwaysShown: false,
    bemBlockClassName: {
      base: 'pure-slider',
      theme: '-slider'
    },
    onDrag: (_) => H.trace,
    range: [0, 100],
    step: 10
  });

  const tooltip = handle.getTooltip();

  const node = handle.getNode() as HTMLDivElement;

  pipe(document, H.querySelector('body'), O.some, O.map((body) => {
    if (O.isSome(body)) {
      pipe(body, H.prop('value'), H.setInlineStyle('margin: 0;'), H.appendTo)(container);
    }
  }));

  return ({handle, node, tooltip});
};

describe('Handle', () => {
  describe('Method of', () => {
    A.map((orientation: Namespace.Orientation) => {
      const {handle, node} = getSubjects({orientation, type: 'start', showTooltip: false});

      it(`should init element with ${orientation} orientation`, () => {
        expect(handle).toBeInstanceOf(Handle);
        expect(node).toHaveClass('pure-slider__handle');
        expect(node).toHaveClass('-slider__handle');
        expect(node).toHaveClass(`pure-slider__handle_orientation_${orientation}`);
        expect(node).toHaveClass(`-slider__handle_orientation_${orientation}`);
      });
    })(['horizontal', 'vertical']);

    it('should render tooltip, if showTooltip prop is true', () => {
      A.map((showTooltip: boolean) => {
        const {tooltip} = getSubjects({showTooltip, orientation: 'horizontal', type: 'start'});

        showTooltip ? expect(tooltip).toBeInstanceOf(Tooltip) : expect(tooltip).not.toBeInstanceOf(Tooltip);
      })([true, false]);
    });
  });


  describe('Method moveTo', () => {
    it('should move handle and set tooltip\'s value', () => {
      A.map((orientation: Namespace.Orientation) => {
        A.map(({type, test}: ArrayElement<Namespace.MoveMap>) => {
          const {handle, node, tooltip} = getSubjects({orientation, type, showTooltip: true});

          A.map(({currents, expected}: ArrayElement<ArrayElement<Namespace.MoveMap>['test']>) => {
            handle.moveTo(currents);

            if (tooltip) {
              expect(Number(tooltip.getNode().innerText)).toEqual(expected);
            }

            if (orientation === 'horizontal') {
              expect(node.style.left).toEqual(`calc(${expected}% - 0px)`);
            }

            if (orientation === 'vertical') {
              expect(node.style.bottom).toEqual(`calc(${expected}% - 0px)`);
            }
          })(test);
        })(D.moveMap);
      })(['horizontal', 'vertical']);
    });
  });

  describe('Drag event', () => {
    it('should return delta coordinate', () => {
      const spy = spyOn(console, 'log');

      A.map((orientation: Namespace.Orientation) => {
        const {node} = getSubjects({orientation, type: 'start', showTooltip: false});

        A.map(({delta, expected}: ArrayElement<Namespace.DragMap>) => {
          node.dispatchEvent(new MouseEvent('mousedown', {clientX: 0, clientY: 0, bubbles: true}));

          window.dispatchEvent(new MouseEvent('mousemove', {clientX: delta, clientY: H.negate(delta), bubbles: true}));
          window.dispatchEvent(new MouseEvent('mouseup', {clientX: delta, clientY: H.negate(delta), bubbles: true}));

          expect(console.log).toHaveBeenCalledWith(expected);

          spy.calls.reset();
        })(D.dragMap);
      })(['horizontal', 'vertical']);
    });
  });
});