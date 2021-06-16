import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';

import * as H from '../../../../../../helpers';

import Element from '../index';

import Namespace from './namespace';

const getSubjects: Namespace.GetSubjects = (key) => {
  const container = H.node('div');

  const node = pipe(H.node('div'), H.appendTo(container));

  const element = new Element(
    {
      container,
      orientation: 'horizontal',
      bemBlockClassName: {
        base: 'pure-slider',
        theme: '-slider'
      },
      range: [0, 100]
    },
    node,
    key
  );

  return ({container, node, element});
};

describe('Element', () => {
  describe('Method getNode', () => {
    const {element, node} = getSubjects('base');

    it('should return node', () => {
      expect(element.getNode()).toEqual(node);
    });
  });

  describe('Method destroy', () => {
    it('should remove node from DOM, if element\'s key is not equal to "container", else must remove plugin\'s class list', () => {
      A.map((key: Namespace.NodeKeys) => {
        const {element} = getSubjects(key);

        element.destroy();

        if (key === 'container') {
          expect(element.getNode()).not.toHaveClass('pure-slider');
          expect(element.getNode()).not.toHaveClass('-slider');

          return;
        }

        expect(element.getNode().parentNode).toEqual(null);
      })(['base', 'container', 'unit', 'scale', 'handle', 'connect', 'tooltip']);
    });
  });
});